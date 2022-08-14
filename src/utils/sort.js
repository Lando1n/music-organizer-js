const _ = require('lodash');
const mm = require('music-metadata');
const path = require('path');
const fs = require('fs');

const { getFilesRecursively } = require('./files');

module.exports = async (unsortedPath, sortedPath, format = '<Song>') => {
  let movedFiles = 0;

  const supportedFormats = ['.mp3', '.flac'];
  const unsortedFiles = getFilesRecursively(unsortedPath, [], supportedFormats);

  for (const startingLocation of unsortedFiles) {
    const metadata = await mm.parseFile(startingLocation);
    const number = _.get(metadata, ['common', 'track', 'no']) || 0;
    const title =
      metadata.common.title ||
      path
        .basename(startingLocation)
        .replace(path.extname(startingLocation), '');
    const artist = metadata.common.albumartist || 'Unknown Artist';
    const album = metadata.common.album || 'Unknown Album';

    const filename = `${format
      .replace('<Number>', number)
      .replace('<Song>', title)
      .replace('<Album>', album)
      .replace('<Artist>', artist)}${path.extname(startingLocation)}`;

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
