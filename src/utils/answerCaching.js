const fs = require('fs');
const path = require('path');

const cacheDir = path.join(__dirname, '..', '..', 'cache');
const cacheLocation = path.join(cacheDir, 'previousAnswer.json');

function cacheAnswers(responses) {
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
  fs.writeFileSync(cacheLocation, JSON.stringify(responses, null, 2));
}

function getAnswerCache() {
  return require(cacheLocation);
}

module.exports = {
  cacheAnswers,
  getAnswerCache
};
