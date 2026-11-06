const vscode = require('vscode');

// Comprehensive AutoSys JIL attribute reference for Hover & Auto-Complete
const JIL_ATTRIBUTES = {
  insert_job: {
    summary: 'Defines a new job in the AutoSys database.',
    syntax: 'insert_job: job_name   job_type: CMD | BOX | FW | FT | POJO | SCP | FTP',
    example: 'insert_job: DAILY_ETL_JOB   job_type: CMD'
  },
  update_job: {
    summary: 'Updates attributes of an existing job in the AutoSys database.',
    syntax: 'update_job: job_name',
    example: 'update_job: DAILY_ETL_JOB'
  },
  delete_job: {
    summary: 'Deletes an existing job from the AutoSys database.',
    syntax: 'delete_job: job_name',
    example: 'delete_job: OLD_JOB_NAME'
  },
  delete_box: {
    summary: 'Deletes an existing box job and all jobs inside it.',
    syntax: 'delete_box: box_name',
    example: 'delete_box: OLD_BOX_NAME'
  },
  rename_job: {
    summary: 'Renames an existing job in the AutoSys database.',
    syntax: 'rename_job: old_name',
    example: 'rename_job: OLD_NAME'
  },
  job_type: {
    summary: 'Specifies the type of job to create.',
    values: ['CMD (Command)', 'BOX (Box container)', 'FW (File Watcher)', 'FT (File Trigger)', 'POJO (Java POJO)', 'SCP (Secure Copy)', 'FTP / SFTP', 'SQL', 'OMP'],
    syntax: 'job_type: CMD | BOX | FW | FT | POJO | SCP | FTP | SQL | OMP',
    example: 'job_type: SCP'
  },
  box_name: {
    summary: 'Places this job inside the specified Box container job.',
    syntax: 'box_name: box_job_name',
    example: 'box_name: NIGHTLY_BATCH_BOX'
  },
  command: {
    summary: 'The shell command, script, or executable to run (required for CMD jobs).',
    syntax: 'command: /path/to/script.sh [args]',
    example: 'command: /opt/etl/run_extract.sh --env prod'
  },
  machine: {
    summary: 'The target agent machine (or virtual machine) where the job executes.',
    syntax: 'machine: hostname',
    example: 'machine: prod-etl-node01'
  },
  owner: {
    summary: 'The OS user account under which the job runs.',
    syntax: 'owner: user@host',
    example: 'owner: batchusr@prod'
  },
  permission: {
    summary: 'Access permissions for running (`x`) or editing (`e`) the job by Group (`g`), World (`w`), or Machine (`m`).',
    values: ['gx', 'ge', 'wx', 'we', 'mx', 'me'],
    syntax: 'permission: gx,ge,wx',
    example: 'permission: gx,ge,wx'
  },
  condition: {
    summary: 'Starting dependencies based on other jobs\' statuses, exit codes, or global variables.',
    values: [
      's(job) — Success',
      'f(job) — Failure',
      't(job) — Terminated',
      'd(job) — Done (s, f, or t)',
      'n(job) — Not Running',
      'e(job) = 0 — Exit Code',
      'v(global_var) = "val" — Global Variable'
    ],
    syntax: 'condition: s(JOB_A) & !f(JOB_B)',
    example: 'condition: s(EXTRACT_JOB) and d(CLEANUP_JOB)'
  },
  date_conditions: {
    summary: 'Toggles whether calendar/time attributes (`days_of_week`, `start_times`, `start_mins`, `run_calendar`) are active.',
    values: ['1 (or y / yes)', '0 (or n / no)'],
    syntax: 'date_conditions: 1 | 0',
    example: 'date_conditions: 1'
  },
  days_of_week: {
    summary: 'Days of the week on which the job should run (requires `date_conditions: 1`).',
    values: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su', 'all'],
    syntax: 'days_of_week: mo,tu,we,th,fr,sa,su | all',
    example: 'days_of_week: mo,tu,we,th,fr'
  },
  start_times: {
    summary: 'Exact 24-hour clock times (`HH:MM`) when the job should start (requires `date_conditions: 1`).',
    syntax: 'start_times: "HH:MM[,HH:MM]"',
    example: 'start_times: "06:30, 18:30"'
  },
  start_mins: {
    summary: 'Minutes past every hour when the job should run (`00`–`59`, requires `date_conditions: 1`).',
    syntax: 'start_mins: 00, 15, 30, 45',
    example: 'start_mins: 15, 45'
  },
  run_window: {
    summary: 'Time window (`"HH:MM-HH:MM"`) during which the job is eligible to start.',
    syntax: 'run_window: "HH:MM-HH:MM"',
    example: 'run_window: "01:00-05:00"'
  },
  run_calendar: {
    summary: 'Custom AutoSys calendar defining the dates on which the job runs.',
    syntax: 'run_calendar: calendar_name',
    example: 'run_calendar: US_BUSINESS_DAYS'
  },
  exclude_calendar: {
    summary: 'Custom AutoSys calendar defining holidays or blackout dates when the job must not run.',
    syntax: 'exclude_calendar: calendar_name',
    example: 'exclude_calendar: US_BANK_HOLIDAYS'
  },
  description: {
    summary: 'Human-readable description of the job\'s purpose.',
    syntax: 'description: "text"',
    example: 'description: "Loads daily customer transactions into warehouse"'
  },
  std_out_file: {
    summary: 'File path where standard output (`stdout`) is redirected.',
    syntax: 'std_out_file: "/path/to/log.out"',
    example: 'std_out_file: "/var/log/autosys/$AUTO_JOB_NAME.out"'
  },
  std_err_file: {
    summary: 'File path where standard error (`stderr`) is redirected.',
    syntax: 'std_err_file: "/path/to/log.err"',
    example: 'std_err_file: "/var/log/autosys/$AUTO_JOB_NAME.err"'
  },
  std_in_file: {
    summary: 'File path used as standard input (`stdin`) for the command.',
    syntax: 'std_in_file: "/path/to/input.txt"',
    example: 'std_in_file: "/opt/etl/input_params.txt"'
  },
  max_run_alarm: {
    summary: 'Maximum run time (in minutes) before raising a `MAXRUNALARM` alert.',
    syntax: 'max_run_alarm: minutes',
    example: 'max_run_alarm: 120'
  },
  min_run_alarm: {
    summary: 'Minimum expected run time (in minutes); raises `MINRUNALARM` if the job finishes faster.',
    syntax: 'min_run_alarm: minutes',
    example: 'min_run_alarm: 5'
  },
  term_run_time: {
    summary: 'Maximum run time (in minutes) before AutoSys automatically terminates the job.',
    syntax: 'term_run_time: minutes',
    example: 'term_run_time: 180'
  },
  alarm_if_fail: {
    summary: 'Specifies whether to raise a `JOBFAILURE` alarm in WCC/Event Server if the job fails.',
    values: ['1 (or y)', '0 (or n)'],
    syntax: 'alarm_if_fail: 1 | 0',
    example: 'alarm_if_fail: 1'
  },
  alarm_if_terminated: {
    summary: 'Specifies whether to raise an alarm if the job is terminated.',
    values: ['1 (or y)', '0 (or n)'],
    syntax: 'alarm_if_terminated: 1 | 0',
    example: 'alarm_if_terminated: 1'
  },
  box_terminator: {
    summary: 'If `1` (`y`), terminates the parent Box if this job fails or terminates.',
    values: ['1', '0', 'y', 'n'],
    syntax: 'box_terminator: 1 | 0',
    example: 'box_terminator: 1'
  },
  job_terminator: {
    summary: 'If `1` (`y`), terminates this job immediately if its parent Box fails or terminates.',
    values: ['1', '0', 'y', 'n'],
    syntax: 'job_terminator: 1 | 0',
    example: 'job_terminator: 1'
  },
  box_success: {
    summary: 'Custom condition expression that defines when a Box job is considered successful.',
    syntax: 'box_success: s(JOB_A) & s(JOB_B)',
    example: 'box_success: s(FINAL_STEP_JOB)'
  },
  box_failure: {
    summary: 'Custom condition expression that defines when a Box job is considered failed.',
    syntax: 'box_failure: f(CRITICAL_JOB)',
    example: 'box_failure: f(CRITICAL_JOB)'
  },
  max_exit_success: {
    summary: 'The highest exit code still treated as `SUCCESS` (default is `0`).',
    syntax: 'max_exit_success: exit_code',
    example: 'max_exit_success: 4'
  },
  success_codes: {
    summary: 'Comma-separated list or ranges of exit codes that indicate job `SUCCESS`.',
    syntax: 'success_codes: 0, 2, 10-20',
    example: 'success_codes: 0, 4'
  },
  fail_codes: {
    summary: 'Comma-separated list or ranges of exit codes that indicate job `FAILURE`.',
    syntax: 'fail_codes: 1, 5-9',
    example: 'fail_codes: 1, 99'
  },
  n_retrys: {
    summary: 'Number of times to automatically restart the job after a failure.',
    syntax: 'n_retrys: count',
    example: 'n_retrys: 3'
  },
  auto_hold: {
    summary: 'Puts the job in `ON_HOLD` status automatically when its parent Box starts.',
    values: ['1', '0', 'y', 'n'],
    syntax: 'auto_hold: 1 | 0',
    example: 'auto_hold: 0'
  },
  auto_delete: {
    summary: 'Deletes the job automatically `N` hours after completion (`-1` disables, `0` deletes immediately).',
    syntax: 'auto_delete: hours | -1',
    example: 'auto_delete: -1'
  },
  timezone: {
    summary: 'Timezone used to evaluate scheduling times for this job.',
    syntax: 'timezone: TZ_NAME',
    example: 'timezone: America/Chicago'
  },
  application: {
    summary: 'Logical grouping tag associating the job with an application.',
    syntax: 'application: app_name',
    example: 'application: FINANCE_BILLING'
  },
  group: {
    summary: 'Logical grouping tag associating the job with a department or batch group.',
    syntax: 'group: group_name',
    example: 'group: NIGHTLY_DW'
  },
  profile: {
    summary: 'Path to an environment profile script sourced before the job command executes.',
    syntax: 'profile: "/path/to/profile"',
    example: 'profile: "/etc/autosys/prod.profile"'
  },
  envvars: {
    summary: 'Environment variables (`KEY=VALUE`) passed to the job execution environment.',
    syntax: 'envvars: VAR1=val1, VAR2="val2"',
    example: 'envvars: APP_ENV=prod, LOG_LEVEL=INFO'
  },
  watch_file: {
    summary: 'Path to the file monitored by a File Watcher (`FW`) or File Trigger (`FT`) job.',
    syntax: 'watch_file: "/path/to/file"',
    example: 'watch_file: "/data/incoming/feed_*.csv"'
  },
  watch_interval: {
    summary: 'Polling interval in seconds for checking the watched file.',
    syntax: 'watch_interval: seconds',
    example: 'watch_interval: 60'
  },
  watch_file_min_size: {
    summary: 'Minimum file size (in bytes) required before the File Watcher succeeds.',
    syntax: 'watch_file_min_size: bytes',
    example: 'watch_file_min_size: 1024'
  },
  watch_file_type: {
    summary: 'Type of file event to monitor (`CREATE`, `DELETE`, `EXPAND`, `EXIST`, `NOTEXIST`, `SHRINK`, `UPDATE`).',
    values: ['CREATE', 'DELETE', 'EXPAND', 'EXIST', 'NOTEXIST', 'SHRINK', 'UPDATE'],
    syntax: 'watch_file_type: CREATE | UPDATE | ...',
    example: 'watch_file_type: CREATE'
  },
  watch_file_change_type: {
    summary: 'Unit for monitoring file size changes (`DELTA`, `PERCENT`, `SIZE`).',
    values: ['DELTA', 'PERCENT', 'SIZE'],
    syntax: 'watch_file_change_type: DELTA | PERCENT | SIZE',
    example: 'watch_file_change_type: SIZE'
  },
  watch_file_change_value: {
    summary: 'Threshold value associated with `watch_file_change_type`.',
    syntax: 'watch_file_change_value: integer',
    example: 'watch_file_change_value: 1024'
  },
  watch_file_recursive: {
    summary: 'Whether to recursively monitor subdirectories for the watched file.',
    values: ['1', '0', 'y', 'n'],
    syntax: 'watch_file_recursive: 1 | 0',
    example: 'watch_file_recursive: 1'
  },
  watch_file_win_user: {
    summary: 'Windows user account used when monitoring files on UNC/network paths.',
    syntax: 'watch_file_win_user: domain\\user',
    example: 'watch_file_win_user: CORP\\svc_autosys'
  },
  watch_no_change: {
    summary: 'Minutes the file must remain unchanged (steady state) before the File Watcher completes.',
    syntax: 'watch_no_change: minutes',
    example: 'watch_no_change: 2'
  },
  continuous: {
    summary: 'Enables continuous monitoring mode for File Trigger (`FT`) jobs (`1` or `y`, or alert name).',
    syntax: 'continuous: 1 | 0',
    example: 'continuous: 1'
  },
  class_name: {
    summary: 'Fully qualified Java class name to instantiate (required for `POJO` jobs).',
    syntax: 'class_name: "com.company.ClassName"',
    example: 'class_name: "com.acme.batch.BatchProcessor"'
  },
  method_name: {
    summary: 'Java method name to invoke on the POJO class (required for `POJO` jobs).',
    syntax: 'method_name: "methodName"',
    example: 'method_name: "runBatch"'
  },
  j2ee_parameter: {
    summary: 'Parameter type and value passed to the POJO method (`type=value`).',
    syntax: 'j2ee_parameter: "java.lang.String=arg1"',
    example: 'j2ee_parameter: "java.lang.String=2026-11-06"'
  },
  send_notification: {
    summary: 'Controls when email or service desk notifications are sent (`0`/`n`, `1`/`y`, or `f` on failure).',
    values: ['0', '1', 'y', 'n', 'f'],
    syntax: 'send_notification: 1 | 0 | f',
    example: 'send_notification: f'
  },
  notification_emailaddress: {
    summary: 'Recipient email address(es) for job notifications.',
    syntax: 'notification_emailaddress: user@example.com',
    example: 'notification_emailaddress: oncall@example.com'
  },
  notification_emailaddress_on_alarm: {
    summary: 'Recipient email address(es) notified specifically when an alarm is raised.',
    syntax: 'notification_emailaddress_on_alarm: user@example.com',
    example: 'notification_emailaddress_on_alarm: ops-alerts@example.com'
  },
  notification_emailaddress_on_failure: {
    summary: 'Recipient email address(es) notified specifically when the job fails.',
    syntax: 'notification_emailaddress_on_failure: user@example.com',
    example: 'notification_emailaddress_on_failure: dev-team@example.com'
  },
  notification_alarm_types: {
    summary: 'Specific alarm types that trigger a notification (e.g., `JOBFAILURE`, `MAXRUNALARM`).',
    values: ['ALL', 'JOBFAILURE', 'MAXRUNALARM', 'MINRUNALARM', 'MUSTCOMPLETEALARM', 'MUSTSTARTALARM', 'JOBTERMINATED'],
    syntax: 'notification_alarm_types: JOBFAILURE, MAXRUNALARM',
    example: 'notification_alarm_types: JOBFAILURE, MAXRUNALARM'
  },
  notification_msg: {
    summary: 'Custom message text included in the notification.',
    syntax: 'notification_msg: "message"',
    example: 'notification_msg: "Critical batch job failed - check logs"'
  },
  notification_template: {
    summary: 'Email template name used when formatting notifications.',
    syntax: 'notification_template: "template_name"',
    example: 'notification_template: "default_failure_tpl"'
  },
  must_start_times: {
    summary: 'Time by which the job must start before raising `MUSTSTARTALARM`.',
    syntax: 'must_start_times: "HH:MM"',
    example: 'must_start_times: "07:15"'
  },
  must_complete_times: {
    summary: 'Time by which the job must finish before raising `MUSTCOMPLETEALARM`.',
    syntax: 'must_complete_times: "HH:MM"',
    example: 'must_complete_times: "09:00"'
  },
  priority: {
    summary: 'Queue priority (`0` = run immediately, `1`–`99` = queued priority).',
    syntax: 'priority: 0',
    example: 'priority: 0'
  },
  job_load: {
    summary: 'Relative load units consumed by this job on the target machine.',
    syntax: 'job_load: integer',
    example: 'job_load: 10'
  },
  resources: {
    summary: 'Virtual resource dependencies required before the job can run.',
    syntax: 'resources: (RES_NAME, QUANTITY=1, FREE=Y)',
    example: 'resources: (DB_CONN_POOL, QUANTITY=1, FREE=Y)'
  },
  scp_transfer_direction: {
    summary: 'Transfer direction for an `SCP` job (`UPLOAD` or `DOWNLOAD`, or `ASC`/`BIN`).',
    values: ['UPLOAD', 'DOWNLOAD'],
    syntax: 'scp_transfer_direction: UPLOAD | DOWNLOAD',
    example: 'scp_transfer_direction: DOWNLOAD'
  },
  scp_server: {
    summary: 'Remote server hostname or IP address for an `SCP` file transfer job.',
    syntax: 'scp_server: hostname',
    example: 'scp_server: sftp.partner.com'
  },
  scp_server_port: {
    summary: 'Remote SSH/SCP port number (default is `22`).',
    syntax: 'scp_server_port: port',
    example: 'scp_server_port: 22'
  },
  scp_remote_dir: {
    summary: 'Remote directory path on the SCP server.',
    syntax: 'scp_remote_dir: "/remote/path"',
    example: 'scp_remote_dir: "/incoming/feeds"'
  },
  scp_remote_name: {
    summary: 'Remote file name on the SCP server.',
    syntax: 'scp_remote_name: "filename"',
    example: 'scp_remote_name: "daily_extract.csv"'
  },
  scp_local_dir: {
    summary: 'Local directory path on the agent machine for an `SCP` transfer.',
    syntax: 'scp_local_dir: "/local/path"',
    example: 'scp_local_dir: "/data/staging"'
  },
  scp_local_name: {
    summary: 'Local file name on the agent machine for an `SCP` transfer.',
    syntax: 'scp_local_name: "/local/path/filename"',
    example: 'scp_local_name: "/data/staging/daily_extract.csv"'
  },
  scp_user: {
    summary: 'Remote user account used to authenticate with the SCP server.',
    syntax: 'scp_user: username',
    example: 'scp_user: svc_scp_xfer'
  },
  scp_local_user: {
    summary: 'Local user account on the agent machine executing the SCP transfer.',
    syntax: 'scp_local_user: username',
    example: 'scp_local_user: batchusr'
  },
  scp_target_os: {
    summary: 'Operating system type of the remote SCP server (`UNIX`, `WINDOWS`, etc.).',
    values: ['UNIX', 'WINDOWS'],
    syntax: 'scp_target_os: UNIX | WINDOWS',
    example: 'scp_target_os: UNIX'
  },
  scp_protocol: {
    summary: 'Protocol used for secure transfer (`SCP` or `SFTP`).',
    values: ['SCP', 'SFTP'],
    syntax: 'scp_protocol: SCP | SFTP',
    example: 'scp_protocol: SFTP'
  }
};

const CONDITION_STATUS_DOCS = {
  s: { name: 'SUCCESS (s)', desc: 'True when the referenced job has completed with status `SUCCESS`.' },
  success: { name: 'SUCCESS', desc: 'True when the referenced job has completed with status `SUCCESS`.' },
  f: { name: 'FAILURE (f)', desc: 'True when the referenced job has ended with status `FAILURE`.' },
  failure: { name: 'FAILURE', desc: 'True when the referenced job has ended with status `FAILURE`.' },
  t: { name: 'TERMINATED (t)', desc: 'True when the referenced job was killed/terminated (`TERMINATED`).' },
  terminated: { name: 'TERMINATED', desc: 'True when the referenced job was killed/terminated (`TERMINATED`).' },
  d: { name: 'DONE (d)', desc: 'True when the referenced job finishes with `SUCCESS`, `FAILURE`, or `TERMINATED`.' },
  done: { name: 'DONE', desc: 'True when the referenced job finishes with `SUCCESS`, `FAILURE`, or `TERMINATED`.' },
  n: { name: 'NOTRUNNING (n)', desc: 'True when the referenced job is not currently in `RUNNING` state.' },
  notrunning: { name: 'NOTRUNNING', desc: 'True when the referenced job is not currently in `RUNNING` state.' },
  e: { name: 'EXITCODE (e)', desc: 'Evaluates the numeric exit code of the referenced job (e.g., `e(JOB_A) = 0`).' },
  exitcode: { name: 'EXITCODE', desc: 'Evaluates the numeric exit code of the referenced job.' },
  v: { name: 'VALUE / GLOBAL VAR (v)', desc: 'Evaluates the value of an AutoSys global variable (e.g., `v(ENV_FLAG) = "PROD"`).' },
  value: { name: 'VALUE / GLOBAL VAR', desc: 'Evaluates the value of an AutoSys global variable.' }
};

/**
 * Strip block comments /* ... *\/ and line comments # ... while preserving line indices and character offsets.
 */
function stripCommentsPreservingLayout(text) {
  // Replace block comments with spaces (preserving newlines)
  let cleaned = text.replace(/\/\*[\s\S]*?\*\//g, (match) =>
    match.replace(/[^\r\n]/g, ' ')
  );
  // Replace # line comments (outside double quotes)
  cleaned = cleaned.replace(/^([^"\r\n]*?(?:"[^"\r\n]*"[^"\r\n]*?)*)#.*$/gm, (full, prefix) =>
    prefix + ' '.repeat(full.length - prefix.length)
  );
  return cleaned;
}

/**
 * Parse a JIL document into structured Job definitions, attributes, and condition links.
 */
function parseJilDocument(document) {
  const rawText = document.getText();
  const cleanedText = stripCommentsPreservingLayout(rawText);
  const lines = cleanedText.split(/\r?\n/);

  const jobs = [];
  let currentJob = null;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    if (!line.trim()) {
      continue;
    }

    // Match all key: value pairs on the line (handles `insert_job: NAME job_type: CMD`)
    const attrRegex = /\b([a-zA-Z0-9_]+)\s*:\s*/g;
    const matches = [];
    let match;
    while ((match = attrRegex.exec(line)) !== null) {
      matches.push({
        key: match[1],
        keyStart: match.index,
        valueStart: attrRegex.lastIndex
      });
    }

    for (let i = 0; i < matches.length; i++) {
      const current = matches[i];
      const next = matches[i + 1];
      const valueEnd = next ? next.keyStart : line.length;
      const rawValue = line.slice(current.valueStart, valueEnd).trim();
      const key = current.key;

      if (
        key === 'insert_job' ||
        key === 'update_job' ||
        key === 'delete_job' ||
        key === 'delete_box' ||
        key === 'rename_job'
      ) {
        if (currentJob) {
          currentJob.endLine = Math.max(currentJob.startLine, lineIdx - 1);
          jobs.push(currentJob);
        }
        const jobName = rawValue.split(/\s+/)[0] || 'UNNAMED_JOB';
        currentJob = {
          name: jobName,
          action: key,
          jobType: key === 'delete_box' ? 'BOX' : 'CMD',
          boxName: null,
          command: null,
          machine: null,
          condition: null,
          description: null,
          startLine: lineIdx,
          endLine: lineIdx,
          nameRange: new vscode.Range(
            lineIdx,
            current.valueStart,
            lineIdx,
            current.valueStart + jobName.length
          ),
          attributes: {}
        };
      } else if (currentJob) {
        currentJob.endLine = lineIdx;
        currentJob.attributes[key] = {
          value: rawValue,
          line: lineIdx,
          keyStart: current.keyStart,
          keyEnd: current.keyStart + key.length,
          valueStart: current.valueStart,
          valueEnd
        };

        if (key === 'job_type') {
          currentJob.jobType = normalizeJobType(rawValue);
        } else if (key === 'box_name') {
          currentJob.boxName = rawValue.replace(/^"|"$/g, '').trim();
        } else if (key === 'command') {
          currentJob.command = rawValue;
        } else if (key === 'machine') {
          currentJob.machine = rawValue;
        } else if (key === 'condition') {
          currentJob.condition = rawValue;
        } else if (key === 'description') {
          currentJob.description = rawValue.replace(/^"|"$/g, '');
        }
      }
    }
  }

  if (currentJob) {
    currentJob.endLine = Math.max(currentJob.startLine, lines.length - 1);
    jobs.push(currentJob);
  }

  return jobs;
}

function normalizeJobType(val) {
  const upper = (val || '').trim().toUpperCase();
  if (upper === 'B' || upper === 'BOX') return 'BOX';
  if (upper === 'C' || upper === 'CMD') return 'CMD';
  if (upper === 'FW') return 'FW';
  if (upper === 'FT') return 'FT';
  if (upper === 'POJO') return 'POJO';
  if (upper === 'SCP') return 'SCP';
  if (upper === 'FTP' || upper === 'SFTP') return upper;
  return upper || 'CMD';
}

function extractConditionDeps(conditionStr) {
  if (!conditionStr) return [];
  const deps = [];
  const regex = /\b(s|f|t|d|n|e|v|success|failure|terminated|done|notrunning|exitcode|value)\s*\(\s*([^)\s,]+)\s*\)/gi;
  let m;
  while ((m = regex.exec(conditionStr)) !== null) {
    const status = m[1].toLowerCase();
    const target = m[2];
    if (status !== 'v' && status !== 'value') {
      deps.push({ status: status[0], target });
    }
  }
  return deps;
}

/**
 * FEATURE 3: Document Outline & Breadcrumbs (DocumentSymbolProvider)
 */
class JilDocumentSymbolProvider {
  provideDocumentSymbols(document) {
    const jobs = parseJilDocument(document);
    const boxSymbolMap = new Map();
    const topLevelSymbols = [];

    // First pass: create symbols for all jobs
    const jobEntries = jobs.map((job) => {
      const range = new vscode.Range(
        job.startLine,
        0,
        job.endLine,
        document.lineAt(job.endLine).text.length
      );
      const isBox = job.jobType === 'BOX';
      const kind = isBox
        ? vscode.SymbolKind.Package
        : job.jobType === 'FW' || job.jobType === 'FT'
          ? vscode.SymbolKind.File
          : job.jobType === 'POJO'
            ? vscode.SymbolKind.Class
            : vscode.SymbolKind.Function;

      const detailParts = [job.jobType];
      if (job.action !== 'insert_job') {
        detailParts.unshift(job.action);
      }
      if (job.machine) {
        detailParts.push(`@${job.machine}`);
      }

      const symbol = new vscode.DocumentSymbol(
        job.name,
        detailParts.join(' • '),
        kind,
        range,
        job.nameRange
      );

      // Add attribute children inside each job for rich breadcrumb drilldown
      for (const [attrKey, attrInfo] of Object.entries(job.attributes)) {
        const attrRange = new vscode.Range(
          attrInfo.line,
          attrInfo.keyStart,
          attrInfo.line,
          attrInfo.valueEnd
        );
        const attrSymbol = new vscode.DocumentSymbol(
          attrKey,
          attrInfo.value,
          vscode.SymbolKind.Property,
          attrRange,
          attrRange
        );
        symbol.children.push(attrSymbol);
      }

      if (isBox && job.action === 'insert_job') {
        boxSymbolMap.set(job.name, symbol);
      }
      return { job, symbol };
    });

    // Second pass: nest jobs inside their parent Box if the Box is in this file
    for (const { job, symbol } of jobEntries) {
      if (job.boxName && boxSymbolMap.has(job.boxName) && job.name !== job.boxName) {
        boxSymbolMap.get(job.boxName).children.unshift(symbol);
      } else {
        topLevelSymbols.push(symbol);
      }
    }

    return topLevelSymbols;
  }
}

/**
 * FEATURE 4: Hover Tooltips & Auto-Complete (IntelliSense)
 */
class JilHoverProvider {
  provideHover(document, position) {
    const wordRange = document.getWordRangeAtPosition(position, /[a-zA-Z0-9_]+/);
    if (!wordRange) return null;

    const word = document.getText(wordRange);
    const lineText = document.lineAt(position.line).text;

    // Check if hovering over a condition status function like s(JOB_A)
    const afterWord = lineText.slice(wordRange.end.character);
    if (/^\s*\(/.test(afterWord) && CONDITION_STATUS_DOCS[word.toLowerCase()]) {
      const info = CONDITION_STATUS_DOCS[word.toLowerCase()];
      const md = new vscode.MarkdownString();
      md.appendMarkdown(`### AutoSys Condition: \`${info.name}\`\n\n`);
      md.appendMarkdown(`${info.desc}\n\n`);
      md.appendCodeblock(`condition: ${word}(JOB_NAME)`, 'jil');
      return new vscode.Hover(md, wordRange);
    }

    // Check if hovering over a known JIL attribute
    const attrDoc = JIL_ATTRIBUTES[word];
    if (attrDoc) {
      const md = new vscode.MarkdownString();
      md.appendMarkdown(`### \`${word}\` — AutoSys JIL Attribute\n\n`);
      md.appendMarkdown(`${attrDoc.summary}\n\n`);
      if (attrDoc.values && attrDoc.values.length > 0) {
        md.appendMarkdown(`**Allowed Values:** \`${attrDoc.values.join('` | `')}\`\n\n`);
      }
      md.appendMarkdown(`**Syntax:**\n`);
      md.appendCodeblock(attrDoc.syntax, 'jil');
      md.appendMarkdown(`**Example:**\n`);
      md.appendCodeblock(attrDoc.example, 'jil');
      return new vscode.Hover(md, wordRange);
    }

    // Check if hovering over a job name defined in the current file
    const jobs = parseJilDocument(document);
    const matchedJob = jobs.find((j) => j.name === word);
    if (matchedJob) {
      const md = new vscode.MarkdownString();
      md.appendMarkdown(`### Job: \`${matchedJob.name}\` (${matchedJob.jobType})\n\n`);
      if (matchedJob.description) {
        md.appendMarkdown(`*${matchedJob.description}*\n\n`);
      }
      if (matchedJob.boxName) {
        md.appendMarkdown(`- **Parent Box:** \`${matchedJob.boxName}\`\n`);
      }
      if (matchedJob.machine) {
        md.appendMarkdown(`- **Machine:** \`${matchedJob.machine}\`\n`);
      }
      if (matchedJob.command) {
        md.appendMarkdown(`- **Command:** \`${matchedJob.command}\`\n`);
      }
      if (matchedJob.condition) {
        md.appendMarkdown(`- **Condition:** \`${matchedJob.condition}\`\n`);
      }
      md.appendMarkdown(`\n*Defined on line ${matchedJob.startLine + 1}*`);
      return new vscode.Hover(md, wordRange);
    }

    return null;
  }
}

class JilCompletionProvider {
  provideCompletionItems(document, position) {
    const linePrefix = document.lineAt(position).text.slice(0, position.character);

    // Context-aware value completions after specific attributes
    const attrMatch = linePrefix.match(/\b([a-zA-Z0-9_]+)\s*:\s*([^:]*)$/);
    if (attrMatch) {
      const attrName = attrMatch[1];
      const jobs = parseJilDocument(document);

      if (attrName === 'job_type') {
        return ['CMD', 'BOX', 'FW', 'FT', 'POJO', 'SCP', 'FTP', 'SFTP', 'SQL', 'OMP'].map((t) => {
          const item = new vscode.CompletionItem(t, vscode.CompletionItemKind.EnumMember);
          item.detail = `AutoSys ${t} job type`;
          return item;
        });
      }

      if (attrName === 'days_of_week') {
        return ['mo,tu,we,th,fr', 'all', 'mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'].map((d) => {
          const item = new vscode.CompletionItem(d, vscode.CompletionItemKind.Constant);
          item.detail = 'Day(s) of week';
          return item;
        });
      }

      if (attrName === 'permission') {
        return ['gx,ge,wx', 'gx,ge,wx,we', 'gx,wx', 'gx', 'ge', 'wx', 'we', 'mx', 'me'].map((p) => {
          const item = new vscode.CompletionItem(p, vscode.CompletionItemKind.Constant);
          item.detail = 'AutoSys permission';
          return item;
        });
      }

      if (attrName === 'box_name') {
        const boxes = jobs.filter((j) => j.jobType === 'BOX');
        const names = boxes.length > 0 ? boxes.map((b) => b.name) : jobs.map((j) => j.name);
        return [...new Set(names)].map((name) => {
          const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Module);
          item.detail = 'Box Job in current file';
          return item;
        });
      }

      if (attrName === 'condition' || attrName === 'box_success' || attrName === 'box_failure') {
        const items = [];
        const statuses = [
          { prefix: 's', label: 'Success' },
          { prefix: 'f', label: 'Failure' },
          { prefix: 't', label: 'Terminated' },
          { prefix: 'd', label: 'Done' },
          { prefix: 'n', label: 'Not Running' }
        ];
        for (const st of statuses) {
          const snippetItem = new vscode.CompletionItem(
            `${st.prefix}(JOB_NAME)`,
            vscode.CompletionItemKind.Function
          );
          snippetItem.insertText = new vscode.SnippetString(`${st.prefix}(\${1:JOB_NAME})`);
          snippetItem.detail = `${st.label} condition`;
          items.push(snippetItem);

          for (const j of jobs) {
            const jobCond = new vscode.CompletionItem(
              `${st.prefix}(${j.name})`,
              vscode.CompletionItemKind.Reference
            );
            jobCond.detail = `${st.label} of ${j.name} (${j.jobType})`;
            items.push(jobCond);
          }
        }
        return items;
      }

      if (
        [
          'date_conditions',
          'alarm_if_fail',
          'alarm_if_terminated',
          'box_terminator',
          'job_terminator',
          'auto_hold',
          'watch_file_recursive',
          'continuous'
        ].includes(attrName)
      ) {
        return ['1', '0', 'y', 'n'].map((v) => {
          const item = new vscode.CompletionItem(v, vscode.CompletionItemKind.Value);
          item.detail = v === '1' || v === 'y' ? 'Enable (Yes)' : 'Disable (No)';
          return item;
        });
      }
    }

    // Default: suggest all JIL attributes
    return Object.entries(JIL_ATTRIBUTES).map(([key, info]) => {
      const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Property);
      item.detail = info.summary;
      item.documentation = new vscode.MarkdownString(
        `${info.summary}\n\n\`\`\`jil\n${info.example}\n\`\`\``
      );
      if (key === 'insert_job') {
        item.insertText = new vscode.SnippetString(
          'insert_job: ${1:JOB_NAME}   job_type: ${2|CMD,BOX,FW,FT,POJO,SCP,FTP|}'
        );
      } else {
        item.insertText = new vscode.SnippetString(`${key}: $0`);
      }
      return item;
    });
  }
}

/**
 * FEATURE 5: JIL Linter & Validator (Diagnostics)
 */
const VALID_JOB_TYPES = new Set([
  'B', 'BOX',
  'C', 'CMD',
  'FW', 'FT',
  'POJO', 'SCP', 'FTP', 'SFTP',
  'SQL', 'OMP', 'I5', 'BW', 'SAP', 'HTTP', 'JMS', 'EJB', 'WS'
]);

const VALID_DAYS = new Set(['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su', 'all']);
const VALID_PERMS = new Set(['gx', 'ge', 'wx', 'we', 'mx', 'me']);

function validateJilDocument(document, diagnosticCollection) {
  if (document.languageId !== 'jil') return;

  const diagnostics = [];
  const jobs = parseJilDocument(document);
  const seenInsertJobs = new Map();

  // Check for unclosed block comments /* without */
  const rawText = document.getText();
  const openCommentIdx = rawText.lastIndexOf('/*');
  const closeCommentIdx = rawText.lastIndexOf('*/');
  if (openCommentIdx !== -1 && openCommentIdx > closeCommentIdx) {
    const pos = document.positionAt(openCommentIdx);
    diagnostics.push(
      new vscode.Diagnostic(
        new vscode.Range(pos, pos.translate(0, 2)),
        'Unclosed block comment `/*` — missing closing `*/`.',
        vscode.DiagnosticSeverity.Error
      )
    );
  }

  for (const job of jobs) {
    // 1. Duplicate insert_job names in the same file
    if (job.action === 'insert_job') {
      if (seenInsertJobs.has(job.name)) {
        const firstLine = seenInsertJobs.get(job.name) + 1;
        diagnostics.push(
          new vscode.Diagnostic(
            job.nameRange,
            `Duplicate 'insert_job: ${job.name}' (already defined on line ${firstLine}).`,
            vscode.DiagnosticSeverity.Warning
          )
        );
      } else {
        seenInsertJobs.set(job.name, job.startLine);
      }
    }

    // 2. Validate job_type
    const jobTypeAttr = job.attributes.job_type;
    if (jobTypeAttr) {
      const rawType = jobTypeAttr.value.trim().toUpperCase();
      if (!VALID_JOB_TYPES.has(rawType)) {
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(
              jobTypeAttr.line,
              jobTypeAttr.valueStart,
              jobTypeAttr.line,
              jobTypeAttr.valueEnd
            ),
            `Unknown job_type '${jobTypeAttr.value}'. Expected CMD, BOX, FW, FT, POJO, SCP, FTP, SFTP, SQL, or OMP.`,
            vscode.DiagnosticSeverity.Error
          )
        );
      }
    }

    // 3. Required attributes by job_type on insert_job
    if (job.action === 'insert_job') {
      if (job.jobType === 'CMD' && !job.attributes.command) {
        diagnostics.push(
          new vscode.Diagnostic(
            job.nameRange,
            `CMD job '${job.name}' is missing a 'command:' attribute.`,
            vscode.DiagnosticSeverity.Warning
          )
        );
      }
      if ((job.jobType === 'FW' || job.jobType === 'FT') && !job.attributes.watch_file) {
        diagnostics.push(
          new vscode.Diagnostic(
            job.nameRange,
            `${job.jobType} job '${job.name}' is missing a 'watch_file:' attribute.`,
            vscode.DiagnosticSeverity.Warning
          )
        );
      }
      if (job.jobType === 'POJO' && (!job.attributes.class_name || !job.attributes.method_name)) {
        diagnostics.push(
          new vscode.Diagnostic(
            job.nameRange,
            `POJO job '${job.name}' requires both 'class_name:' and 'method_name:' attributes.`,
            vscode.DiagnosticSeverity.Warning
          )
        );
      }
      if (job.jobType === 'BOX' && job.attributes.command) {
        const cmdAttr = job.attributes.command;
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(cmdAttr.line, cmdAttr.keyStart, cmdAttr.line, cmdAttr.valueEnd),
            `BOX job '${job.name}' cannot have a 'command:' attribute (boxes are containers).`,
            vscode.DiagnosticSeverity.Error
          )
        );
      }
    }

    // 4. Scheduling attributes used without date_conditions: 1 / y
    const scheduleAttrs = ['days_of_week', 'start_times', 'start_mins', 'run_calendar', 'run_window'];
    const presentScheduleAttrs = scheduleAttrs.filter((k) => job.attributes[k]);
    if (presentScheduleAttrs.length > 0 && job.action === 'insert_job') {
      const dc = job.attributes.date_conditions;
      const dcEnabled = dc && ['1', 'y', 'yes'].includes(dc.value.trim().toLowerCase());
      if (!dcEnabled) {
        const firstSched = job.attributes[presentScheduleAttrs[0]];
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(
              firstSched.line,
              firstSched.keyStart,
              firstSched.line,
              firstSched.valueEnd
            ),
            `'${presentScheduleAttrs.join(', ')}' specified on '${job.name}', but 'date_conditions: 1' is missing or disabled. Schedule will be ignored by AutoSys.`,
            vscode.DiagnosticSeverity.Warning
          )
        );
      }
    }

    // 5. Validate days_of_week tokens
    const dowAttr = job.attributes.days_of_week;
    if (dowAttr) {
      const tokens = dowAttr.value
        .split(/[,\s]+/)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
      const invalidDays = tokens.filter((t) => !VALID_DAYS.has(t));
      if (invalidDays.length > 0) {
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(dowAttr.line, dowAttr.valueStart, dowAttr.line, dowAttr.valueEnd),
            `Invalid day(s) in days_of_week: '${invalidDays.join(', ')}'. Valid values: mo, tu, we, th, fr, sa, su, all.`,
            vscode.DiagnosticSeverity.Error
          )
        );
      }
    }

    // 6. Validate permission tokens
    const permAttr = job.attributes.permission;
    if (permAttr) {
      const tokens = permAttr.value
        .split(/[,\s]+/)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
      const invalidPerms = tokens.filter((t) => !VALID_PERMS.has(t));
      if (invalidPerms.length > 0) {
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(permAttr.line, permAttr.valueStart, permAttr.line, permAttr.valueEnd),
            `Invalid permission token(s): '${invalidPerms.join(', ')}'. Valid values: gx, ge, wx, we, mx, me.`,
            vscode.DiagnosticSeverity.Error
          )
        );
      }
    }

    // 7. Validate balanced parentheses in condition / box_success / box_failure
    for (const condKey of ['condition', 'box_success', 'box_failure']) {
      const cAttr = job.attributes[condKey];
      if (!cAttr) continue;
      let depth = 0;
      for (const ch of cAttr.value) {
        if (ch === '(') depth++;
        if (ch === ')') depth--;
        if (depth < 0) break;
      }
      if (depth !== 0) {
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(cAttr.line, cAttr.valueStart, cAttr.line, cAttr.valueEnd),
            `Unbalanced parentheses in '${condKey}: ${cAttr.value}'.`,
            vscode.DiagnosticSeverity.Error
          )
        );
      }

      // Self-dependency check
      const deps = extractConditionDeps(cAttr.value);
      for (const dep of deps) {
        if (dep.target === job.name) {
          diagnostics.push(
            new vscode.Diagnostic(
              new vscode.Range(cAttr.line, cAttr.valueStart, cAttr.line, cAttr.valueEnd),
              `Job '${job.name}' has a self-referencing condition '${dep.status}(${dep.target})'.`,
              vscode.DiagnosticSeverity.Warning
            )
          );
        }
      }
    }
  }

  diagnosticCollection.set(document.uri, diagnostics);
}

/**
 * FEATURE 6: Interactive Visual Job Dependency Graph (Webview Panel)
 */
let graphPanel = null;

function openOrUpdateJobGraph(context, document) {
  if (!document || document.languageId !== 'jil') {
    vscode.window.showInformationMessage('Open an AutoSys .jil file first to visualize its job flow.');
    return;
  }

  const columnToShowIn = vscode.ViewColumn.Beside;
  if (graphPanel) {
    graphPanel.reveal(columnToShowIn, true);
  } else {
    graphPanel = vscode.window.createWebviewPanel(
      'jilJobGraph',
      'AutoSys JIL Job Flow',
      { viewColumn: columnToShowIn, preserveFocus: true },
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    graphPanel.onDidDispose(
      () => {
        graphPanel = null;
      },
      null,
      context.subscriptions
    );

    graphPanel.webview.onDidReceiveMessage(
      async (msg) => {
        if (msg.type === 'jumpToLine' && typeof msg.line === 'number') {
          const targetUri = vscode.Uri.parse(msg.uri);
          const doc = await vscode.workspace.openTextDocument(targetUri);
          const editor = await vscode.window.showTextDocument(doc, vscode.ViewColumn.One);
          const pos = new vscode.Position(msg.line, 0);
          editor.selection = new vscode.Selection(pos, pos);
          editor.revealRange(
            new vscode.Range(pos, pos),
            vscode.TextEditorRevealType.InCenter
          );
        }
      },
      null,
      context.subscriptions
    );
  }

  const jobs = parseJilDocument(document);
  graphPanel.title = `JIL Flow: ${document.fileName.split(/[\\/]/).pop()}`;
  graphPanel.webview.html = buildGraphWebviewHtml(jobs, document.uri.toString(), document.fileName);
}

function buildGraphWebviewHtml(jobs, docUri, fileName) {
  const graphData = {
    uri: docUri,
    fileName: fileName.split(/[\\/]/).pop(),
    jobs: jobs.map((j) => ({
      name: j.name,
      action: j.action,
      jobType: j.jobType,
      boxName: j.boxName || null,
      machine: j.machine || null,
      command: j.command || null,
      condition: j.condition || null,
      description: j.description || null,
      startTime: j.attributes.start_times ? j.attributes.start_times.value.replace(/^"|"$/g, '') : null,
      daysOfWeek: j.attributes.days_of_week ? j.attributes.days_of_week.value : null,
      watchFile: j.attributes.watch_file ? j.attributes.watch_file.value.replace(/^"|"$/g, '') : null,
      line: j.startLine,
      deps: [
        ...extractConditionDeps(j.condition),
        ...extractConditionDeps(j.attributes.box_success ? j.attributes.box_success.value : null),
        ...extractConditionDeps(j.attributes.box_failure ? j.attributes.box_failure.value : null)
      ]
    }))
  };

  const serialized = JSON.stringify(graphData).replace(/</g, '\\u003c');

  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>AutoSys JIL Job Flow</title>
<style>
  :root {
    --bg: var(--vscode-editor-background, #1e1e2e);
    --fg: var(--vscode-editor-foreground, #cdd6f4);
    --card-bg: var(--vscode-editorWidget-background, #252538);
    --border: var(--vscode-panel-border, #3b3b54);
    --accent: #38bdf8;
    --box-accent: #f59e0b;
    --cmd-accent: #38bdf8;
    --fw-accent: #a855f7;
    --pojo-accent: #10b981;
    --scp-accent: #ec4899;
    --ext-accent: #64748b;
    --s-color: #22c55e;
    --f-color: #ef4444;
    --t-color: #f97316;
    --d-color: #3b82f6;
    --n-color: #eab308;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0;
    background: var(--bg);
    color: var(--fg);
    font-family: var(--vscode-font-family, system-ui, -apple-system, sans-serif);
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--card-bg);
    flex-wrap: wrap;
    z-index: 10;
  }
  .title-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .title-group h2 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
  }
  .stats {
    display: flex;
    gap: 8px;
    font-size: 11px;
  }
  .badge {
    padding: 2px 8px;
    border-radius: 999px;
    font-weight: 600;
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.04);
  }
  .controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  input[type="search"] {
    background: var(--bg);
    color: var(--fg);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 12px;
    width: 170px;
  }
  button {
    background: var(--bg);
    color: var(--fg);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 4px 10px;
    font-size: 12px;
    cursor: pointer;
  }
  button:hover {
    border-color: var(--accent);
  }
  .legend {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 6px 16px;
    font-size: 11px;
    border-bottom: 1px solid var(--border);
    background: rgba(0, 0, 0, 0.15);
    flex-wrap: wrap;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 3px;
    display: inline-block;
  }
  #viewport {
    flex: 1;
    position: relative;
    overflow: auto;
    padding: 24px;
  }
  #canvas {
    position: relative;
    transform-origin: 0 0;
    min-width: 600px;
    min-height: 400px;
  }
  svg#edges {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: visible;
    z-index: 2;
  }
  .columns {
    display: flex;
    flex-direction: column;
    gap: 28px;
    position: relative;
    z-index: 3;
  }
  .box-container {
    border: 2px dashed rgba(245, 158, 11, 0.55);
    border-radius: 10px;
    background: rgba(245, 158, 11, 0.04);
    padding: 14px;
  }
  .box-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(245, 158, 11, 0.25);
    cursor: pointer;
  }
  .box-header:hover .box-title {
    color: var(--box-accent);
    text-decoration: underline;
  }
  .box-title {
    font-weight: 700;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .box-meta {
    font-size: 11px;
    opacity: 0.8;
  }
  .job-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 22px 44px;
    align-items: flex-start;
  }
  .job-card {
    width: 230px;
    border-radius: 8px;
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-left: 4px solid var(--cmd-accent);
    padding: 10px 12px;
    cursor: pointer;
    transition: transform 0.12s ease, box-shadow 0.12s ease, opacity 0.15s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.22);
  }
  .job-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35);
    border-color: var(--accent);
  }
  .job-card.type-BOX { border-left-color: var(--box-accent); }
  .job-card.type-CMD { border-left-color: var(--cmd-accent); }
  .job-card.type-FW, .job-card.type-FT { border-left-color: var(--fw-accent); }
  .job-card.type-POJO { border-left-color: var(--pojo-accent); }
  .job-card.type-SCP, .job-card.type-FTP, .job-card.type-SFTP { border-left-color: var(--scp-accent); }
  .job-card.type-EXT {
    border-left-color: var(--ext-accent);
    border-style: dashed;
    opacity: 0.82;
  }
  .job-card.dimmed {
    opacity: 0.22;
  }
  .job-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    margin-bottom: 6px;
  }
  .job-name {
    font-weight: 700;
    font-size: 12.5px;
    word-break: break-all;
  }
  .job-type-pill {
    font-size: 10px;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.08);
    flex-shrink: 0;
  }
  .job-detail {
    font-size: 11px;
    opacity: 0.82;
    margin-top: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .job-cond-badge {
    margin-top: 6px;
    padding-top: 5px;
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    font-size: 10.5px;
    font-family: var(--vscode-editor-font-family, monospace);
    color: #93c5fd;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    opacity: 0.7;
  }
</style>
</head>
<body>
  <header>
    <div class="title-group">
      <h2 id="file-title">AutoSys JIL Flow</h2>
      <div class="stats" id="stats"></div>
    </div>
    <div class="controls">
      <input type="search" id="search" placeholder="Filter jobs or boxes..." />
      <button id="zoom-out" title="Zoom Out">−</button>
      <button id="zoom-reset" title="Reset Zoom">100%</button>
      <button id="zoom-in" title="Zoom In">+</button>
    </div>
  </header>
  <div class="legend">
    <div class="legend-item"><span class="dot" style="background: var(--box-accent)"></span> BOX Container</div>
    <div class="legend-item"><span class="dot" style="background: var(--cmd-accent)"></span> CMD Job</div>
    <div class="legend-item"><span class="dot" style="background: var(--fw-accent)"></span> FW / FT Watcher</div>
    <div class="legend-item"><span class="dot" style="background: var(--pojo-accent)"></span> POJO Job</div>
    <div class="legend-item"><span class="dot" style="background: var(--scp-accent)"></span> SCP / FTP Job</div>
    <div class="legend-item"><span class="dot" style="background: var(--s-color)"></span> s() Success</div>
    <div class="legend-item"><span class="dot" style="background: var(--f-color)"></span> f() Failure</div>
    <div class="legend-item"><span class="dot" style="background: var(--d-color)"></span> d() Done</div>
    <div class="legend-item"><span class="dot" style="background: var(--t-color)"></span> t() Terminated</div>
    <div class="legend-item" style="margin-left:auto; opacity:0.75">Click any job or box to jump to its JIL definition</div>
  </div>
  <div id="viewport">
    <div id="canvas">
      <svg id="edges"></svg>
      <div class="columns" id="content"></div>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    const DATA = ${serialized};

    const contentEl = document.getElementById('content');
    const edgesSvg = document.getElementById('edges');
    const statsEl = document.getElementById('stats');
    const searchInput = document.getElementById('search');
    const canvasEl = document.getElementById('canvas');
    document.getElementById('file-title').textContent = 'AutoSys JIL Flow — ' + DATA.fileName;

    let zoom = 1;
    function applyZoom() {
      canvasEl.style.transform = 'scale(' + zoom + ')';
      document.getElementById('zoom-reset').textContent = Math.round(zoom * 100) + '%';
      requestAnimationFrame(drawEdges);
    }
    document.getElementById('zoom-in').onclick = () => { zoom = Math.min(1.6, zoom + 0.15); applyZoom(); };
    document.getElementById('zoom-out').onclick = () => { zoom = Math.max(0.5, zoom - 0.15); applyZoom(); };
    document.getElementById('zoom-reset').onclick = () => { zoom = 1; applyZoom(); };

    function escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function renderGraph() {
      const jobs = DATA.jobs;
      if (!jobs.length) {
        contentEl.innerHTML = '<div class="empty-state">No JIL jobs found in this file yet. Type <code>cmd_job</code> or <code>box_job</code> to create one!</div>';
        return;
      }

      const knownNames = new Set(jobs.map(j => j.name));
      const externalDeps = new Set();
      jobs.forEach(j => {
        (j.deps || []).forEach(d => {
          if (!knownNames.has(d.target)) externalDeps.add(d.target);
        });
      });

      const boxJobs = jobs.filter(j => j.jobType === 'BOX');
      const boxMap = new Map();
      boxJobs.forEach(b => boxMap.set(b.name, { box: b, children: [] }));

      const standaloneJobs = [];
      jobs.forEach(j => {
        if (j.jobType === 'BOX') return;
        if (j.boxName) {
          if (!boxMap.has(j.boxName)) {
            boxMap.set(j.boxName, {
              box: { name: j.boxName, jobType: 'BOX', external: true, line: j.line },
              children: []
            });
          }
          boxMap.get(j.boxName).children.push(j);
        } else {
          standaloneJobs.push(j);
        }
      });

      statsEl.innerHTML = [
        '<span class="badge">' + jobs.length + ' Jobs</span>',
        '<span class="badge">' + boxMap.size + ' Boxes</span>',
        externalDeps.size ? '<span class="badge">' + externalDeps.size + ' External Refs</span>' : ''
      ].join('');

      let html = '';

      // Render External Prerequisite Jobs if any
      if (externalDeps.size > 0) {
        html += '<div class="box-container" style="border-color: rgba(100,116,139,0.5); background: rgba(100,116,139,0.05);">';
        html += '<div class="box-header" style="cursor:default"><div class="box-title">External / Upstream Dependencies</div></div>';
        html += '<div class="job-grid">';
        externalDeps.forEach(extName => {
          html += '<div class="job-card type-EXT" data-job="' + escapeHtml(extName) + '">';
          html += '<div class="job-card-header"><span class="job-name">' + escapeHtml(extName) + '</span><span class="job-type-pill">EXTERNAL</span></div>';
          html += '<div class="job-detail">Referenced in condition</div>';
          html += '</div>';
        });
        html += '</div></div>';
      }

      // Render each Box and its member jobs
      boxMap.forEach(({ box, children }) => {
        const metaParts = [];
        if (box.startTime) metaParts.push('⏰ ' + escapeHtml(box.startTime));
        if (box.daysOfWeek) metaParts.push('📅 ' + escapeHtml(box.daysOfWeek));
        if (box.condition) metaParts.push('🔗 ' + escapeHtml(box.condition));

        html += '<div class="box-container" data-job="' + escapeHtml(box.name) + '" data-line="' + (box.line || 0) + '">';
        html += '<div class="box-header" data-line="' + (box.line || 0) + '">';
        html += '<div class="box-title">📦 ' + escapeHtml(box.name) + ' <span class="job-type-pill">BOX</span></div>';
        html += '<div class="box-meta">' + metaParts.join(' &nbsp;•&nbsp; ') + '</div>';
        html += '</div>';
        html += '<div class="job-grid">';
        if (children.length === 0) {
          html += '<div class="job-detail" style="opacity:0.6">No child jobs assigned to this box in this file</div>';
        } else {
          children.forEach(ch => { html += renderJobCard(ch); });
        }
        html += '</div></div>';
      });

      // Render Standalone jobs
      if (standaloneJobs.length > 0) {
        html += '<div class="box-container" style="border-color: rgba(56,189,248,0.35); background: rgba(56,189,248,0.03);">';
        html += '<div class="box-header" style="cursor:default"><div class="box-title">Standalone Jobs</div></div>';
        html += '<div class="job-grid">';
        standaloneJobs.forEach(j => { html += renderJobCard(j); });
        html += '</div></div>';
      }

      contentEl.innerHTML = html;

      // Attach click handlers to jump to JIL line
      document.querySelectorAll('.job-card[data-line], .box-header[data-line]').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const line = parseInt(el.getAttribute('data-line'), 10);
          if (!isNaN(line)) {
            vscode.postMessage({ type: 'jumpToLine', uri: DATA.uri, line });
          }
        });
      });

      requestAnimationFrame(drawEdges);
    }

    function renderJobCard(j) {
      const details = [];
      if (j.machine) details.push('🖥️ ' + escapeHtml(j.machine));
      if (j.startTime) details.push('⏰ ' + escapeHtml(j.startTime));
      if (j.command) details.push('⚡ ' + escapeHtml(j.command));
      if (j.watchFile) details.push('👁️ ' + escapeHtml(j.watchFile));
      if (j.description) details.push('📝 ' + escapeHtml(j.description));

      let card = '<div class="job-card type-' + escapeHtml(j.jobType) + '" data-job="' + escapeHtml(j.name) + '" data-line="' + j.line + '">';
      card += '<div class="job-card-header">';
      card += '<span class="job-name">' + escapeHtml(j.name) + '</span>';
      card += '<span class="job-type-pill">' + escapeHtml(j.jobType) + '</span>';
      card += '</div>';
      details.slice(0, 3).forEach(d => {
        card += '<div class="job-detail" title="' + d + '">' + d + '</div>';
      });
      if (j.condition) {
        card += '<div class="job-cond-badge" title="condition: ' + escapeHtml(j.condition) + '">condition: ' + escapeHtml(j.condition) + '</div>';
      }
      card += '</div>';
      return card;
    }

    function drawEdges() {
      const canvasRect = canvasEl.getBoundingClientRect();
      const statusColors = {
        s: '#22c55e',
        f: '#ef4444',
        t: '#f97316',
        d: '#3b82f6',
        n: '#eab308',
        e: '#a855f7'
      };

      let defs = '<defs>';
      Object.entries(statusColors).forEach(([k, color]) => {
        defs += '<marker id="arrow-' + k + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">';
        defs += '<path d="M 0 1 L 10 5 L 0 9 z" fill="' + color + '" />';
        defs += '</marker>';
      });
      defs += '</defs>';

      let paths = '';
      DATA.jobs.forEach(job => {
        if (!job.deps || !job.deps.length) return;
        const targetEl = document.querySelector('[data-job="' + CSS.escape(job.name) + '"]');
        if (!targetEl) return;

        job.deps.forEach(dep => {
          const sourceEl = document.querySelector('[data-job="' + CSS.escape(dep.target) + '"]');
          if (!sourceEl || sourceEl === targetEl) return;

          const sRect = sourceEl.getBoundingClientRect();
          const tRect = targetEl.getBoundingClientRect();

          const x1 = (sRect.left + sRect.width / 2 - canvasRect.left) / zoom;
          const y1 = (sRect.bottom - canvasRect.top) / zoom;
          const x2 = (tRect.left + tRect.width / 2 - canvasRect.left) / zoom;
          const y2 = (tRect.top - canvasRect.top) / zoom;

          const dy = Math.max(30, Math.abs(y2 - y1) * 0.45);
          const d = 'M ' + x1 + ' ' + y1 + ' C ' + x1 + ' ' + (y1 + dy) + ', ' + x2 + ' ' + (y2 - dy) + ', ' + x2 + ' ' + y2;
          const st = statusColors[dep.status] ? dep.status : 's';
          const color = statusColors[st];

          paths += '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-opacity="0.78" marker-end="url(#arrow-' + st + ')" />';
        });
      });

      edgesSvg.innerHTML = defs + paths;
    }

    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      document.querySelectorAll('.job-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.classList.toggle('dimmed', q.length > 0 && !text.includes(q));
      });
    });

    window.addEventListener('resize', () => requestAnimationFrame(drawEdges));
    renderGraph();
  </script>
</body>
</html>`;
}

function activate(context) {
  const jilSelector = { language: 'jil', scheme: 'file' };
  const untitledSelector = { language: 'jil', scheme: 'untitled' };
  const selectors = [jilSelector, untitledSelector];

  // Feature 3: Document Outline & Go-to-Symbol
  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider(selectors, new JilDocumentSymbolProvider())
  );

  // Feature 4: Hover Documentation & IntelliSense Auto-Complete
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(selectors, new JilHoverProvider()),
    vscode.languages.registerCompletionItemProvider(
      selectors,
      new JilCompletionProvider(),
      ':',
      ' ',
      '('
    )
  );

  // Feature 5: JIL Linter & Diagnostics
  const diagnosticCollection = vscode.languages.createDiagnosticCollection('autosys-jil');
  context.subscriptions.push(diagnosticCollection);

  if (vscode.window.activeTextEditor) {
    validateJilDocument(vscode.window.activeTextEditor.document, diagnosticCollection);
  }

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        validateJilDocument(editor.document, diagnosticCollection);
        if (graphPanel && editor.document.languageId === 'jil') {
          openOrUpdateJobGraph(context, editor.document);
        }
      }
    }),
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.languageId === 'jil') {
        validateJilDocument(event.document, diagnosticCollection);
        if (graphPanel) {
          openOrUpdateJobGraph(context, event.document);
        }
      }
    }),
    vscode.workspace.onDidCloseTextDocument((doc) => {
      diagnosticCollection.delete(doc.uri);
    })
  );

  // Feature 6: Interactive Visual Job Flow Graph Command
  context.subscriptions.push(
    vscode.commands.registerCommand('jil.showJobGraph', () => {
      const editor = vscode.window.activeTextEditor;
      openOrUpdateJobGraph(context, editor ? editor.document : null);
    })
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
