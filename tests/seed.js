// The seed history already lives in index.html (public). Tests use it, never a real phone copy.
const fs = require('fs'), path = require('path');
module.exports = function seedHistory(file) {
  const s = fs.readFileSync(file || path.join(__dirname, '..', 'index.html'), 'utf8');
  const m = /^const SEED_RECOVERED_HISTORY = (\[.*?\]);\s*$/m.exec(s);
  if (!m) throw new Error('seed history not found in index.html');
  return JSON.parse(m[1]);
};
