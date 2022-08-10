const mm = require('music-metadata');
const path = require('path');
const fs = require('fs');

const { getFilesRecursively } = require('./files');

module.exports = async (unsortedPath, sortedPath, extensions) => {
  let movedFiles = 0;
  const unsortedFiles = getFilesRecursively(unsortedPath, [], extensions);

  for (const startingLocation of unsortedFiles) {
    const metadata = await mm.parseFile(startingLocation);
    const artist = metadata.common.albumartist || 'Unknown Artist';
    const album = metadata.common.album || 'Unknown Album';
    const filename = metadata.common.title
      ? `${metadata.common.title}${path.extname(startingLocation)}`
      : path.basename(startingLocation);
    let pathParts = [artist, album, filename];

    // Remove invalid chars from paths
    let replaceRegex;
    switch (process.platform) {
      case 'win32':
        replaceRegex = /[<>:"/\\|?*]/g;
        break;
      case 'linux':
        replaceRegex = /[/]/g;
        break;
      default:
        throw Error('Only Linux and Windows are currently supported!');
    }
    pathParts = pathParts.map((part) => part.replace(replaceRegex, ''));

    const newLocation = path.join(sortedPath, ...pathParts);
    const dir = path.dirname(newLocation);
    // Create a directory for the file to be moved
    fs.mkdirSync(dir, { recursive: true });
    // Attempt to move the file
    try {
      if (startingLocation !== newLocation) {
        fs.renameSync(startingLocation, newLocation);
        movedFiles++;
        console.log(`Moved ${startingLocation} to ${newLocation}`);
      }
    } catch (e) {
      console.error(`Failed to move file: ${startingLocation}, Reason: ${e}`);
    }
  }
  return movedFiles;
};
