const _ = require('lodash');
const mm = require('music-metadata');
const path = require('path');
const fs = require('fs');

const { getFilesRecursively } = require('./files');

module.exports = async (unsortedDir, sortedDir, format = '<Song>') => {
  let movedFiles = 0;

  const supportedFormats = ['.mp3', '.flac'];
  const unsortedFiles = getFilesRecursively(unsortedDir, [], supportedFormats);

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
    const pathParts = [artist, album, filename].map((part) =>
      part.replace(replaceRegex, '')
    );

    const newLocation = path.join(sortedDir, ...pathParts);

    // Create a directory for the file to be moved
    const newDir = path.dirname(newLocation);
    fs.mkdirSync(newDir, { recursive: true });
    // Attempt to move the file
    try {
      if (startingLocation !== newLocation) {
        fs.renameSync(startingLocation, getUniqueFilePath(newLocation));
        movedFiles++;
        console.log(`Moved ${startingLocation} to ${newLocation}`);
      }
    } catch (e) {
      console.error(`Failed to move file: ${startingLocation}, Reason: ${e}`);
    }
  }
  return movedFiles;
};

// Determine a file path that doesn't already exist
function getUniqueFilePath(location) {
  const { dir, name, ext } = path.parse(location);
  let index = 1;
  while (fs.existsSync(location)) {
    console.debug(
      `Duplicate found '${location}' adding index of ${index} to file name`
    );
    if (index > 20) {
      throw Error('20 copies found for the same file, something may be wrong.');
    }
    location = path.join(dir, `${name} (${index})${ext}`);
    index += 1;
  }
  return location;
}
