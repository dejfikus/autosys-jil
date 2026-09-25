# Change Log

All notable changes to the "Autosys JIL Highlite" extension will be documented in this file.

<!-- Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file. -->

## [0.1.3]
- Renamed extension to **Autosys JIL Highlite**.
- Added new file watching keywords (`watch_file`, `watch_file_recursive`, etc.) and `continuous`.
- Added `success_codes`.

## [0.1.2]
- Added `POJO` to `job_type`.
- Added notification, java, and exit/box success keywords (`class_name`, `method_name`, `j2ee_parameter`, `max_exit_success`, `box_success`, etc.).

## [0.1.1]
- **Bug Fix**: Fixed a critical Regex Lookbehind issue that caused Oniguruma to fail parsing the grammar in VS Code.
- **Bug Fix**: Added missing weekend days (`sa` and `su`).
- **Feature**: Added highlighting support for `update_job` alongside `insert_job`.
- Removed duplicate `notification_template` keyword.

## [0.1.0]

- Initial release