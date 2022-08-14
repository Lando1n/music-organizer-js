const fs = require('fs');
const path = require('path');

class Settings {
  constructor(cachePath) {
    this.path = cachePath;
    const cacheDir = path.dirname(cachePath);
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    this.cache = this.read();
  }

  exists() {
    return fs.existsSync(this.path);
  }

  addTo(cache) {
    this.cache = Object.assign({}, this.cache, cache);
  }

  write() {
    fs.writeFileSync(this.path, JSON.stringify(this.cache, null, 2));
  }

  read() {
    return fs.existsSync(this.path) ? require(this.path) : undefined;
  }

  get() {
    return this.cache;
  }

  validate() {
    return this.cache && JSON.stringify(this.cache) !== JSON.stringify({});
  }
}

module.exports = Settings;
