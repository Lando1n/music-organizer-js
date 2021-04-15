const fs = require('fs');
const path = require('path');

function removeEmptyDirsRecursively(dir, rootContext = dir) {
  if (!fs.existsSync(dir)) {
    return;
  }
  files = fs.readdirSync(dir);

  if (files.length === 0) {
    fs.rmdirSync(dir);
    console.log(`Removing: ${dir}`);
    const parentDir = path.resolve(`${dir}/..`);
    if (parentDir !== rootContext) {
      removeEmptyDirsRecursively(parentDir);
    }
  } else {
    files.forEach((file) => {
      const ref = path.join(dir, file);
      if (fs.existsSync(ref) && fs.statSync(ref).isDirectory()) {
        removeEmptyDirsRecursively(ref, rootContext);
      }
    });
  }
}

module.exports = { removeEmptyDirsRecursively };
