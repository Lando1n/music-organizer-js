const fs = require('fs');
const path = require('path');

function getFilesRecursively(dirPath, arrayOfFiles, withExtensions) {
  files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles.concat(
        getFilesRecursively(
          path.join(dirPath, file),
          arrayOfFiles,
          withExtensions
        )
      );
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles.filter((fullPath) => {
    const ext = path.extname(fullPath);
    return withExtensions.includes(ext);
  });
}

module.exports = getFilesRecursively;
