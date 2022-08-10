const fs = require('fs');
const path = require('path');

class Cache {
  constructor(cachePath) {
    this.path = cachePath;
    const cacheDir = path.dirname(cachePath);
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    this.cache = this.get();
  }

  addTo(cache) {
    this.cache = Object.assign({}, this.cache, cache);
  }

  write() {
    fs.writeFileSync(this.path, JSON.stringify(this.cache, null, 2));
  }

  get() {
    return fs.existsSync(this.path) ? require(this.path) : {};
  }

  validate() {
    return (
      this.cache.unsortedMusicPath &&
      this.cache.sortedMusicPath &&
      this.cache.cleanup
    );
  }
}

module.exports = Cache;
