# Changelog

## [Unreleased]
- Added central logging using Sentry and Slack webhook.
- Refactored Google Sheets API logic into services/google_sheets.py.
- Updated Azure Function in ReadSheetFunction to use central_logger for logging.
- Updated app.py to serve as the main entry point without business logic.
- Updated SharesightFunction to sync holdings and transactions from Sharesight API to the database tables iwr_holdings and iwr_transactions.
- **Added Slack alert for new ticker:** Sends a Slack message when a ticker is added for the first time to the iwr_million_dollar_picks table.
- Incorporated prefix-based logging ([Code][FunctionName][Line Number]) across all modules.
- **Updated services/google_sheets.py** to use service account credentials from `api-project-1072206828633-076f70089c50.json` for accessing the public Google Sheet.
- **Updated** endpoint for reading
- **Modified**: `ReadSheetFunction` now writes data to Postgres DB.
- **Created**: `SharesightFunction` to retrieve holdings from the Sharesight API.

## [Grid Updates]
- **Added**: `grid/Readme.txt` with an in-depth explanation of how the Sanity Grid, custom input component, and relevant schemas work.
- **Improved**: The add/edit workflow in `SanityGrid.tsx` and `itemValue.tsx` to allow selecting a component type if none is set, or editing existing component fields for each grid item.
- **Fixed**: Ensure `_key` is always present in newly added items and newly added components, preventing "Cannot read properties of undefined (reading '_key')" errors.
- **Fixed**: Removed the usage of `prefixAll({ _key: key })` and replaced it with a direct `set()` approach in `handleItemChange`, resolving "Expected field name to be a string" patch errors.
- **Changed**: Now, once `_componenttype` is set, the "Select Component Type" screen won't appear again in `itemValue.tsx`. Also removed forced `_componenttype` assignment in `SanityGrid.tsx`.