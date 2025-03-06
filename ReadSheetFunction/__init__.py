import json
import datetime
import re
import azure.functions as func
from services.google_sheets import read_sheet
from central_logger import log_info, log_error
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
import requests  # Added for Slack alert functionality

# Helper functions for converting sheet values to proper data types
def parse_float(val):
    try:
        val = val.strip()
        # if value indicates missing data, return 0.0 (or you can return None if desired)
        if "N/A" in val.upper():
            return 0.0
        # Remove currency symbols and percentage symbols
        v = val.replace("$", "").replace("%", "")
        # Remove any extraneous non-digit and non-decimal characters (like arrows, symbols, etc.)
        v = re.sub(r'[^\d\.]', '', v)
        return float(v) if v != "" else None
    except Exception as e:
        log_error(f"parse_float error: {e} for value: {val}")
        return None

def parse_int(val):
    try:
        val = val.strip()
        # if value indicates missing or non-numeric data, return None
        if "N/A" in val.upper() or "MARKET" in val.upper() or "BENCHMARK" in val.upper():
            return None
        # Remove commas and other extraneous characters
        v = val.replace(",", "")
        return int(float(v)) if v != "" else None
    except Exception as e:
        log_error(f"parse_int error: {e} for value: {val}")
        return None

def parse_date(val):
    try:
        val = val.strip()
        if val.upper() == "N/A":
            return None
        # Assuming the date format is MM/DD/YYYY
        return datetime.datetime.strptime(val, "%m/%d/%Y").date() if val != "" else None
    except Exception as e:
        log_error(f"parse_date error: {e} for value: {val}")
        return None

def main(req: func.HttpRequest) -> func.HttpResponse:
    log_info("[Code][main][8] Python HTTP trigger function processed a request.")
    
    spreadsheet_id = req.params.get('spreadsheet_id')
    range_name = req.params.get('range_name')
    header_row = req.params.get('header_row')

    log_info(f"[Code][main][14] Received query params: spreadsheet_id={spreadsheet_id}, range_name={range_name}, header_row={header_row}")

    if not spreadsheet_id:
        try:
            req_body = req.get_json()
            log_info(f"[Code][main][20] JSON body parsed successfully: {req_body}")
        except ValueError:
            log_error("[Code][main][23] Could not parse request body as JSON.")
            req_body = {}
        else:
            spreadsheet_id = req_body.get('spreadsheet_id')
            range_name = req_body.get('range_name')
            header_row = req_body.get('header_row')

    if not spreadsheet_id:
        spreadsheet_id = os.getenv("GOOGLE_SHEETS_SPREADSHEET_ID")

    if not header_row:
        header_row = "A7"
        log_info(f"[Code][main][36] No header_row provided. Using default '{header_row}'.")

    if not range_name:
        now = datetime.datetime.now()
        month_year = now.strftime("%B %Y")
        range_name = f"B$FM Stocks {month_year}!{header_row}:59"
        log_info(f"[Code][main][44] No range_name provided. Using default '{range_name}'.")

    try:
        rows = read_sheet(spreadsheet_id, range_name)
        if not rows or len(rows) < 2:
            log_info("[Code][main][51] No data found.")
            return func.HttpResponse("No data found in sheet.", status_code=200)

        # Assume first row is header; data rows follow.
        header = rows[0]
        data_rows = rows[1:]
        log_info(f"[Code][main][52] Found {len(data_rows)} data rows. Header: {header}")

        # Prepare DB connection
        database_url = os.getenv("POSTGRES_URL_ALCHEMY")
        engine = create_engine(database_url)
        Session = sessionmaker(bind=engine)
        session = Session()

        inserted_count = 0
        # Define the expected number of columns based on mapping:
        # 0: Ticker, 1: Company, 3: Last Price, 4: % Since 1/30/25,
        # 5: % Chg Daily, 6: % Trailing 12 Mos, 7: Volume %*,
        # 8: Rank, 9: Current Signal, 10: Short-Term Trend, 11: Long-Term Trend,
        # 12: RSI - Daily, 13: Earnings Date, 14: Sector, 15: Industry,
        # 17: IPO Screen, 18: Rank
        expected_columns = 19
        for idx, row_data in enumerate(data_rows, start=1):
            row_data += [""] * (expected_columns - len(row_data))
            
            log_info(f"[Code][row][{idx}] Raw row data: {row_data}")

            ticker = row_data[0].strip() or None
            company = row_data[1].strip() or None
            last_price = parse_float(row_data[3])
            pct_since_1_30_25 = parse_float(row_data[4])
            pct_chg_daily = parse_float(row_data[5])
            pct_trailing_12_mos = parse_float(row_data[6])
            volume_pct = parse_float(row_data[7])
            rank_1 = parse_int(row_data[8])
            current_signal = row_data[9].strip() or None
            short_term_trend = row_data[10].strip() or None
            long_term_trend = row_data[11].strip() or None
            rsi_daily = parse_float(row_data[12])
            earnings_date = parse_date(row_data[13])
            sector = row_data[14].strip() or None
            industry = row_data[15].strip() or None
            ipo_screen = row_data[17].strip() or None
            rank_2 = parse_int(row_data[18])
            
            log_info(f"[Code][row][{idx}] Parsed values: ticker={ticker}, company={company}, last_price={last_price}, pct_since_1_30_25={pct_since_1_30_25}, pct_chg_daily={pct_chg_daily}, pct_trailing_12_mos={pct_trailing_12_mos}, volume_pct={volume_pct}, rank_1={rank_1}, current_signal={current_signal}, short_term_trend={short_term_trend}, long_term_trend={long_term_trend}, rsi_daily={rsi_daily}, earnings_date={earnings_date}, sector={sector}, industry={industry}, ipo_screen={ipo_screen}, rank_2={rank_2}")
            
            # Check if ticker is new before insertion (alert only if first occurrence)
            if ticker:
                check_query = text("SELECT COUNT(*) FROM iwr_million_dollar_picks WHERE ticker = :ticker")
                existing = session.execute(check_query, {"ticker": ticker}).fetchone()
                if existing[0] == 0:
                    slack_webhook_url = "https://hooks.slack.com/services/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"
                    slack_message = {"text": f"New ticker added: {ticker}"}
                    try:
                        requests.post(slack_webhook_url, json=slack_message)
                        log_info(f"[Code][row][{idx}] Sent Slack alert for new ticker: {ticker}")
                    except Exception as e:
                        log_error(f"[Code][row][{idx}] Failed to send Slack alert for new ticker {ticker}: {e}")

            insert_query = text("""
                INSERT INTO iwr_million_dollar_picks (
                    spreadsheet_id, ticker, company, last_price, pct_since_1_30_25,
                    pct_chg_daily, pct_trailing_12_mos, volume_pct, rank_1,
                    current_signal, short_term_trend, long_term_trend, rsi_daily,
                    earnings_date, sector, industry, ipo_screen, rank_2, date_inserted
                )
                VALUES (
                    :spreadsheet_id, :ticker, :company, :last_price, :pct_since_1_30_25,
                    :pct_chg_daily, :pct_trailing_12_mos, :volume_pct, :rank_1,
                    :current_signal, :short_term_trend, :long_term_trend, :rsi_daily,
                    :earnings_date, :sector, :industry, :ipo_screen, :rank_2, NOW()
                )
            """)
            session.execute(insert_query, {
                "spreadsheet_id": spreadsheet_id,
                "ticker": ticker,
                "company": company,
                "last_price": last_price,
                "pct_since_1_30_25": pct_since_1_30_25,
                "pct_chg_daily": pct_chg_daily,
                "pct_trailing_12_mos": pct_trailing_12_mos,
                "volume_pct": volume_pct,
                "rank_1": rank_1,
                "current_signal": current_signal,
                "short_term_trend": short_term_trend,
                "long_term_trend": long_term_trend,
                "rsi_daily": rsi_daily,
                "earnings_date": earnings_date,
                "sector": sector,
                "industry": industry,
                "ipo_screen": ipo_screen,
                "rank_2": rank_2
            })
            inserted_count += 1

        session.commit()
        session.close()
        log_info(f"[Code][main][75] Successfully inserted {inserted_count} rows into iwr_million_dollar_picks table.")
        resp_data = {
            "spreadsheet_id": spreadsheet_id,
            "inserted_rows": inserted_count
        }
        log_info("[Code][main][86] Completed readSheet function successfully.")
        return func.HttpResponse(json.dumps(resp_data), mimetype="application/json", status_code=200)
    except Exception as e:
        error_msg = f"[Code][main][90] Error reading sheet: {e}"
        log_error(error_msg)
        return func.HttpResponse(error_msg, status_code=500)