# Change Log

All notable changes to the "Autosys JIL Highlite" extension will be documented in this file.

<!-- Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file. -->

## [0.2.0]
- **Interactive Visual Job Flow Graph**: Click the graph icon in the top-right editor toolbar (or run `AutoSys JIL: Open Visual Job Flow Graph`) to see an interactive diagram of all Boxes, Jobs, and `condition:` dependency arrows (`s()`, `f()`, `t()`, `d()`, `n()`). Click any node to jump straight to its JIL line!
- **Document Outline & Breadcrumbs**: Browse a hierarchical tree of all Boxes and child Jobs in VS Code's Outline sidebar and `Ctrl+Shift+O` (`Go to Symbol`).
- **Hover Documentation & IntelliSense Auto-Complete**: Hover over JIL attributes, job names, or condition status codes (`s()`, `f()`, etc.) for instant syntax docs and examples. Context-aware auto-complete suggests `box_name` containers and `condition` job references from your current file.
- **Real-Time JIL Linter & Validator**: Automatically flags missing `date_conditions: 1` when schedule attributes are present, duplicate `insert_job` names, missing required attributes (`command`, `watch_file`, `class_name`/`method_name`), invalid `job_type`/`days_of_week`/`permission` values, and unbalanced parentheses in `condition:`.
- **Code Snippets**: Type `cmd_job`, `box_job`, `fw_job`, `pojo_job`, or `update_job` and press `Tab` to scaffold complete JIL blocks.
- **Complete Syntax Polish**: Added block comment (`/* ... */`) highlighting, all condition statuses (`s`, `f`, `t`, `d`, `n`, `e`, `v`), word-bounded `and`/`or` operators, and additional JIL keywords (`delete_job`, `delete_box`, `rename_job`, `box_failure`, `fail_codes`, `watch_interval`, etc.).

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
