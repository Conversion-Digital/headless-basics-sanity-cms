# Changelog

## [Unreleased]
- Added central logging using Sentry and Slack webhook.
- Refactored Google Sheets API logic into services/google_sheets.py.
- Updated Azure Function in ReadSheetFunction to use central_logger for logging.
- Updated app.py to serve as the main entry point without business logic.
- Updated SharesightFunction to sync holdings and transactions from Sharesight API to the database tables iwr_holdings and iwr_transactions.
- **Added Slack alert for new ticker:** Sends a Slack message when a ticker is added for the first time to the iwr_million_dollar_picks table.

## [Logging and Service Account Updates]
- Incorporated prefix-based logging ([Code][FunctionName][Line Number]) across all modules.
- **Updated services/google_sheets.py to use service account credentials from `api-project-1072206828633-076f70089c50.json` for accessing the public Google Sheet.**

## [Read in all values and set default params]
- Updated endpoint for reading

## [DB & Sharesight Integration]
- **Modified**: `ReadSheetFunction` now writes data to Postgres DB.
- **Created**: `SharesightFunction` to retrieve holdings from the Sharesight API.