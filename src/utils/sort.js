const mm = require('music-metadata');
const path = require('path');
const fs = require('fs');

const getFilesRecursively = require('./getFilesRecursively');

module.exports = (unsortedPath, sortedPath, extensions) => {
  let movedFiles = 0;
  const unsortedFiles = getFilesRecursively(unsortedPath, [], extensions);

  unsortedFiles.forEach(async (startingLocation) => {
    const metadata = await mm.parseFile(startingLocation);
    const dir = path
      .join(sortedPath, metadata.common.albumartist, metadata.common.album)
      .replace(/[,-]/g, '');
    fs.mkdirSync(dir, { recursive: true });
    const newLocation = path.join(dir, path.basename(startingLocation));
    fs.renameSync(startingLocation, newLocation);
    movedFiles++;
    console.log(`Moved ${startingLocation} to ${newLocation}`);
  });
  return movedFiles;
};
