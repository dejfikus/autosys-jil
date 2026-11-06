# Autosys JIL Highlite

A comprehensive VS Code extension for **Broadcom / CA Workload Automation AutoSys Job Information Language (JIL)** — providing rich syntax highlighting, an **Interactive Visual Job Flow Graph**, hierarchical Document Outline & Breadcrumbs, Hover Documentation, Context-Aware IntelliSense, a Real-Time JIL Linter, and Job Scaffolding Snippets.

---

## Available Functionality

### 1. Interactive Visual Job Flow Graph
Visualize your `.jil` files as an interactive dependency diagram right beside your editor:
- **How to open**:
  - Click the **Job Flow Graph** icon (`$(type-hierarchy-sub)`) in the top-right editor toolbar when viewing any `.jil` file.
  - Or right-click inside the editor and select **AutoSys JIL: Open Visual Job Flow Graph**.
  - Or run **AutoSys JIL: Open Visual Job Flow Graph** from the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
- **What it shows**:
  - **Box Containers (`BOX`)**: Automatically groups child jobs inside their parent `box_name` container.
  - **Color-Coded Job Cards**: Distinct badges and borders for `CMD`, `BOX`, `FW` / `FT`, `POJO`, and `SCP` / `FTP` / `SFTP` jobs, displaying machine, schedule, command/watch file, and condition summary.
  - **Dependency Arrows**: Draws color-coded SVG arrows for `condition:`, `box_success:`, and `box_failure:` links:
    - Green: `s(job)` — Success
    - Red: `f(job)` — Failure
    - Blue: `d(job)` — Done
    - Orange: `t(job)` — Terminated
    - Yellow: `n(job)` — Not Running
  - **External / Upstream Jobs**: Automatically surfaces upstream jobs referenced in `condition:` that are defined outside the current `.jil` file.
  - **Click-to-Navigate**: Click any job card or box header in the diagram to jump directly to its exact line in your `.jil` file.
  - **Live Updates, Search & Zoom**: Updates automatically as you type, with a real-time filter bar and zoom controls (`-`, `100%`, `+`).

---

### 2. Document Outline & Breadcrumbs (`Ctrl+Shift+O`)
Navigate large `.jil` files effortlessly:
- Populates VS Code's **Outline** sidebar view and top editor **Breadcrumbs** trail.
- Automatically nests child jobs under their parent `BOX` container when both exist in the file.
- Expands each job to show all of its configured JIL attributes (`command`, `machine`, `condition`, `start_times`, etc.).
- Press `Ctrl+Shift+O` (`Cmd+Shift+O` on macOS) to fuzzy-search and jump to any Box or Job symbol in the file.

---

### 3. Hover Documentation (Tooltips)
Hover your mouse cursor over any element in a `.jil` file for instant built-in reference docs:
- **JIL Attributes**: Displays a description of the attribute, allowed values, syntax, and a ready-to-use JIL example (`insert_job`, `date_conditions`, `watch_file`, `scp_server`, `class_name`, `permission`, etc.).
- **Condition Status Codes**: Hover over `s(...)`, `f(...)`, `t(...)`, `d(...)`, `n(...)`, `e(...)`, or `v(...)` to see how AutoSys evaluates that dependency status.
- **Job Names**: Hover over any job name referenced in `box_name:` or `condition:` (if defined in the same file) to preview its `job_type`, parent box, target `machine`, `command`, and line number.

---

### 4. Context-Aware IntelliSense & Auto-Complete
Start typing or press `Ctrl+Space` inside a `.jil` file:
- **Attribute Suggestions**: Suggests all standard AutoSys JIL attributes with inline documentation previews.
- **Smart Value Completion**:
  - After `job_type:`: Suggests `CMD`, `BOX`, `FW`, `FT`, `POJO`, `SCP`, `FTP`, `SFTP`, `SQL`, `OMP`.
  - After `box_name:`: Automatically suggests all `BOX` jobs defined in the current `.jil` file.
  - After `condition:`, `box_success:`, or `box_failure:`: Suggests `s(JOB)`, `f(JOB)`, `t(JOB)`, `d(JOB)`, and `n(JOB)` pre-populated with every job name in your current file.
  - After `days_of_week:`: Suggests `mo,tu,we,th,fr`, `all`, and individual days (`mo`–`su`).
  - After `permission:`: Suggests common permission combinations (`gx,ge,wx`, `gx,ge,wx,we`, etc.).
  - After boolean flags (`date_conditions`, `alarm_if_fail`, `alarm_if_terminated`, `box_terminator`, `job_terminator`, `auto_hold`, `continuous`): Suggests `1`, `0`, `y`, `n`.

---

### 5. Real-Time JIL Linter & Error Checker
Automatically validates your `.jil` file as you type and highlights issues in the editor and the **Problems** panel (`Ctrl+Shift+M`):
- **Missing `date_conditions: 1`**: Warns when scheduling attributes (`days_of_week`, `start_times`, `start_mins`, `run_calendar`, `run_window`) are set on a job without `date_conditions: 1` (or `y`).
- **Duplicate Job Definitions**: Warns if the same `insert_job` name appears more than once in the same file.
- **Job Type Validation**: Flags unknown `job_type:` values and checks required attributes per type:
  - `CMD` jobs missing `command:`
  - `FW` / `FT` jobs missing `watch_file:`
  - `POJO` jobs missing `class_name:` or `method_name:`
  - `BOX` jobs erroneously containing a `command:` attribute
- **Attribute Format Validation**: Flags invalid day tokens in `days_of_week:`, invalid tokens in `permission:`, unbalanced parentheses in `condition:`, self-referencing job conditions, and unclosed `/* ... */` block comments.

---

### 6. JIL Code Snippets
Type any of these prefixes in a `.jil` file and press `Tab` to scaffold a complete job definition with interactive tab-stops:

| Prefix | Job Type Scaffolded |
| :--- | :--- |
| `cmd_job` (or `insert_cmd`) | Standard Command (`CMD`) job template |
| `box_job` (or `insert_box`) | Box container (`BOX`) job template |
| `fw_job` (or `insert_fw`) | File Watcher (`FW`) job template |
| `pojo_job` (or `insert_pojo`) | Java `POJO` job template |
| `scp_job` (or `insert_scp`) | Secure Copy (`SCP`) file transfer job template |
| `update_job` (or `upd_job`) | Update existing job block |

---

### 7. Complete Syntax Highlighting
- Subcommands: `insert_job`, `update_job`, `delete_job`, `delete_box`, `rename_job`, `insert_machine`, `insert_resource`, `insert_glob`, `insert_monbro`.
- Job Types: `CMD`, `BOX`, `FW`, `FT`, `POJO`, `SCP`, `FTP`, `SFTP`, `SQL`, `OMP`, `I5`, `BW`, `SAP`, `HTTP`, `JMS`, `EJB`, `WS`.
- Scheduling, File Watching (`watch_file*`, `continuous`), SCP/FTP (`scp_*`, `ftp_*`), Java/J2EE (`class_name`, `method_name`, `j2ee_*`), Notification (`notification_*`, `send_notification`), and Service Desk (`svcdesk_*`) attributes.
- Condition statuses (`s()`, `f()`, `t()`, `d()`, `n()`, `e()`, `v()`) and logical operators (`&`, `|`, `and`, `or`, `not`).
- Both `#` line comments and `/* ... */` multi-line block comments.

---

## Development

The grammar source of truth is `syntaxes/jil.tmLanguage.yaml`. To compile changes into `syntaxes/jil.tmLanguage.json`:
```bash
npx js-yaml syntaxes/jil.tmLanguage.yaml > syntaxes/jil.tmLanguage.json
```
