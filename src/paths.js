const path = require('path');

const settingsDir = path.join(__dirname, '..', 'settings');

module.exports = {
  setupSettings: path.join(settingsDir, '.setup.json'),
  organizeSettings: path.join(settingsDir, '.organize.json')
};
