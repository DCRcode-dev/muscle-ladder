// Runs every test file in this folder, one after another. Exit code 1 if any fails.
const { spawnSync } = require('child_process'), fs = require('fs'), path = require('path');
const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.test.js')).sort();
let failed = 0;
for (const f of files) {
  console.log(`\n▶ ${f}`);
  const r = spawnSync(process.execPath, [path.join(__dirname, f)], { stdio: 'inherit', cwd: __dirname, env: Object.assign({ TZ: 'America/Puerto_Rico' }, process.env) });
  if (r.status !== 0) failed++;
}
console.log(failed ? `\n${failed} test file(s) failed` : `\nall ${files.length} test files passed`);
process.exit(failed ? 1 : 0);
