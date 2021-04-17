const fs = require('fs');
const path = require('path');

function getFilesRecursively(dirPath, arrayOfFiles, extensions) {
  files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles.concat(getFilesRecursively(
        path.join(dirPath, file),
        arrayOfFiles,
        extensions
      ));
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles.filter((fullPath) => {
      const name = path.basename(fullPath);
      const ext = path.extname(fullPath);
      return extensions.includes(ext) || extensions.includes(name);
    }
  );
}

module.exports = getFilesRecursively;
