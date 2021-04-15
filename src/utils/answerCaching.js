const fs = require('fs');
const path = require('path');

const cacheDir = path.join(__dirname, '..', '..', 'cache');
const cacheLocation = path.join(cacheDir, 'previousAnswer.json');

function cacheAnswers(responses) {
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
  fs.writeFileSync(cacheLocation, JSON.stringify(responses, null, 2));
}

function getAnswerCache() {
  let cache = {};
  if (fs.existsSync(cacheLocation)) {
    cache = require(cacheLocation);
  }
  return cache;
}

module.exports = {
  cacheAnswers,
  getAnswerCache
};
