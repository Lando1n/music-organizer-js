const fs = require('fs');
const path = require('path');

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

module.exports = getFilesRecursively;
