const mm = require('music-metadata');
const path = require('path');
const fs = require('fs');

const getFilesRecursively = require('./getFilesRecursively');

module.exports = async (unsortedPath, sortedPath, extensions) => {
  let movedFiles = 0;
  const unsortedFiles = getFilesRecursively(unsortedPath, [], extensions);

  for (const startingLocation of unsortedFiles) {
    const metadata = await mm.parseFile(startingLocation);
    const artist = metadata.common.albumartist;
    const album = metadata.common.album;
    const title = metadata.common.title;
    const ext = path.extname(startingLocation);

    let pathParts = [artist, album, `${title}${ext}`];

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
      fs.renameSync(startingLocation, newLocation);
    } catch (e) {
      console.error(`Failed to move file: ${startingLocation}, Reason: ${e}`);
    }
    movedFiles++;
    console.log(`Moved ${startingLocation} to ${newLocation}`);
  }
  return movedFiles;
};
