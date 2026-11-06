# Autosys JIL Highlite

A feature-packed VS Code extension for **AutoSys Job Information Language (JIL)** — featuring syntax highlighting, IntelliSense auto-complete, hover documentation, real-time linting, snippets, document outline hierarchy, and an **Interactive Visual Job Flow Graph**.

## Features

### 1. Interactive Visual Job Flow Graph
Click the **Job Flow Graph** button in the top-right editor title bar (or run `AutoSys JIL: Open Visual Job Flow Graph` from the Command Palette / right-click menu) to visualize your `.jil` file:
- Automatically groups child jobs inside their parent `BOX` containers.
- Draws color-coded dependency arrows for `condition:`, `box_success:`, and `box_failure:` (`s()` Success, `f()` Failure, `d()` Done, `t()` Terminated, `n()` Not Running).
- Highlights external/upstream job dependencies referenced in conditions.
- **Click any job card or box header** in the graph to jump directly to its definition in the editor!

### 2. Document Outline & Breadcrumbs (`Ctrl+Shift+O`)
- View all Boxes and Jobs in VS Code's **Outline** sidebar and top breadcrumb bar.
- Jobs with a `box_name:` attribute are automatically nested under their parent `BOX` symbol.

### 3. Hover Documentation & Context-Aware IntelliSense
- **Hover** over any JIL keyword, condition function (`s()`, `f()`, `t()`, `d()`, `n()`, `e()`, `v()`), or job name to view detailed documentation, allowed values, and examples.
- **Auto-Complete** suggests JIL attributes, valid `job_type` / `days_of_week` / `permission` constants, existing `BOX` names when typing `box_name:`, and existing job names when building `condition:` expressions.

### 4. Real-Time JIL Linter & Diagnostics
Catches common AutoSys JIL mistakes as you type:
- Using `days_of_week`, `start_times`, `start_mins`, or `run_calendar` without enabling `date_conditions: 1`.
- Duplicate `insert_job` definitions in the same file.
- Missing required attributes (`command:` for `CMD`, `watch_file:` for `FW`/`FT`, `class_name:` & `method_name:` for `POJO`).
- Invalid `job_type`, `days_of_week`, or `permission` values.
- Unbalanced parentheses or self-referencing loops in `condition:`.

### 5. JIL Job Snippets
Type any of the following prefixes in a `.jil` file and press `Tab`:
- `cmd_job` — Full Command (`CMD`) job template
- `box_job` — Full Box (`BOX`) container template
- `fw_job` — File Watcher (`FW`) job template
- `pojo_job` — Java `POJO` job template
- `update_job` — Update existing job block

## Development

To compile changes from `syntaxes/jil.tmLanguage.yaml` into `syntaxes/jil.tmLanguage.json`:
```bash
npx js-yaml syntaxes/jil.tmLanguage.yaml > syntaxes/jil.tmLanguage.json
```
