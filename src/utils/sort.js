const mm = require('music-metadata');

const getFilesRecursively = require('./getFilesRecursively');

module.exports = (unsortedPath, sortedPath, extensions) => {
  const unsortedFiles = getFilesRecursively(unsortedPath, [], extensions);

  unsortedFiles.forEach(async (startingLocation) => {
    const metadata = await mm.parseFile(startingLocation);
    const dir = path
      .join(sortedPath, metadata.common.albumartist, metadata.common.album)
      .replace(/[,-]/g, '');
    fs.mkdirSync(dir, { recursive: true });
    const newLocation = path.join(dir, path.basename(startingLocation));
    fs.renameSync(startingLocation, newLocation);
  });
};
