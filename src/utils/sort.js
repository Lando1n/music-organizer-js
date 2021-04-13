const getFilesRecursively = require('./getFilesRecursively');
const mm = require('music-metadata');

module.exports = (unsortedMusicPath) => {
  const musicFiles = getFilesRecursively(unsortedMusicPath, [], ['.mp3']);
  console.log(musicFiles);
  musicFiles.forEach(async (startingLocation) => {
    const metadata = await mm.parseFile(startingLocation);
    const dir = path
      .join(
        res.sortedMusicPath,
        metadata.common.albumartist,
        metadata.common.album
      )
      .replace(/[,-]/g, '');
    fs.mkdirSync(dir, { recursive: true });
    const newLocation = path.join(dir, path.basename(startingLocation));
    fs.renameSync(startingLocation, newLocation);
  });
};
