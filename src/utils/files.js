const fs = require('fs');
const path = require('path');

function removeEmptyDirsRecursively(dir, rootContext = dir) {
  if (!fs.existsSync(dir)) {
    console.warn(`File does not exist, cannot remove: ${dir}`);
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
    for (const file of files) {
      const ref = path.join(dir, file);
      if (fs.existsSync(ref) && fs.statSync(ref).isDirectory()) {
        removeEmptyDirsRecursively(ref, rootContext);
      }
    }
  }
}

function getFilesRecursively(dirPath, arrayOfFiles, withExtensions) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles.concat(
        getFilesRecursively(
          path.join(dirPath, file),
          arrayOfFiles,
          withExtensions
        )
      );
    } else {
      const ext = path.extname(file);
      if (withExtensions.includes(ext)) {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  }

  return arrayOfFiles;
}

module.exports = { removeEmptyDirsRecursively, getFilesRecursively };
