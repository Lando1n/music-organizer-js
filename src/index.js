const os = require('os');
const fs = require('fs');
const path = require('path');

const prompts = require('prompts');
const sort = require('./utils/sort');

const homeDir = os.homedir();

async function main() {
  //TODO: Ask about settings, store to file on first run, confirm on later runs.
  const questions = [
    {
      message: 'Where is your unsorted music?',
      type: 'autocomplete',
      name: 'unsortedMusicPath',
      choices: [
        {
          title: path.join(homeDir, 'Downloads')
        },
        {
          title: path.join(homeDir, 'Music')
        },
        {
          title: 'other'
        }
      ],
      validate: (value) =>
        fs.existsSync(value) && fs.statSync(value).isDirectory()
          ? true
          : "Path doesn't exist"
    },
    {
      message: 'Type in the path to your unsorted music:',
      type: (prev) => (prev === 'other' ? 'text' : null),
      name: 'unsortedMusicPath',
      initial: homeDir,
      validate: (value) =>
        fs.existsSync(value) && fs.statSync(value).isDirectory()
          ? true
          : "Path doesn't exist"
    },
    {
      message: 'Where do you want the music to be sorted to?',
      type: 'autocomplete',
      name: 'sortedMusicPath',
      choices: [
        {
          title: path.join(homeDir, 'Music')
        },
        {
          title: path.join(homeDir, 'Downloads')
        },
        {
          title: 'other'
        }
      ],
      validate: (value) =>
        fs.existsSync(value) && fs.statSync(value).isDirectory()
          ? true
          : "Path doesn't exist"
    },
    {
      message: 'Type in the path to your sorted music:',
      type: (prev) => (prev === 'other' ? 'text' : null),
      name: 'sortedMusicPath',
      initial: homeDir,
      validate: (value) =>
        fs.existsSync(value) && fs.statSync(value).isDirectory()
          ? true
          : "Path doesn't exist"
    }
  ];

  const res = await prompts(questions);

  if (res.unsortedMusicPath) {
    sort(res.unsortedMusicPath);
  }
}

main();
