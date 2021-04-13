const os = require('os');
const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');
const prompts = require('prompts');

const getFilesRecursively = require('./utils/getFilesRecursively');

const homeDir = os.homedir();

async function main() {
  //TODO: Ask about settings, store to file on first run, confirm on later runs.
  const questions = [
    {
      message: 'Where is your unsorted music?',
      type: 'text',
      name: 'unsortedMusicPath',
      initial: path.join(homeDir, 'Downloads'),
      validate: (value) =>
        fs.existsSync(value) && fs.statSync(value).isDirectory()
          ? true
          : "Path doesn't exist"
    },
    {
      message: 'Where do you want the music to be sorted to?',
      type: 'text',
      name: 'sortedMusicPath',
      initial: path.join(homeDir, 'Music'),
      validate: (value) =>
        fs.existsSync(value) && fs.statSync(value).isDirectory()
          ? true
          : "Path doesn't exist"
    }
  ];

  const res = await prompts(questions);

  if (res.unsortedMusicPath) {
    const musicFiles = getFilesRecursively(res.unsortedMusicPath, [], ['.mp3']);
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
  }
}

main();
