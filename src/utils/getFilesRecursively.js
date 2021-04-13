const fs = require('fs');
const path = require('path');

function getFilesRecursively(dirPath, arrayOfFiles, extensions) {
  files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getFilesRecursively(
        path.join(dirPath, file),
        arrayOfFiles,
        extensions
      );
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles.filter((filename) =>
    extensions.includes(path.extname(filename))
  );
}

module.exports = getFilesRecursively;
