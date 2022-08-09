const fs = require('fs');
const path = require('path');

const cacheDir = path.join(__dirname, '..', '..');
const cacheLocation = path.join(cacheDir, '.music-organizer-cache.json');

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

function validateCache(cache) {
  return cache.unsortedMusicPath && cache.sortedMusicPath && cache.cleanup;
}

module.exports = {
  cacheAnswers,
  getAnswerCache,
  validateCache
};
