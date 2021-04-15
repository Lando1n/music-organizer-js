const os = require('os');
const fs = require('fs');
const path = require('path');

const prompts = require('prompts');
const sort = require('./utils/sort');

async function askQuestions() {
  const homeDir = os.homedir();
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
    },
    {
      name: 'confirm',
      type: 'select',
      message: (prev, values) =>
        `Please confirm: You would like to sort music from ${values.unsortedMusicPath} to ${values.sortedMusicPath}`,
      choices: [
        {
          title: 'Yes'
        },
        {
          title: 'No'
        }
      ]
    }
  ];

  let res = await prompts(questions);

  if (res.confirm) {
    console.log("Ok, let's try again then");
    res = await askQuestions();
  }
  return res;
}

async function main() {
  //TODO: Ask about settings, store to file on first run, confirm on later runs.
  const res = await askQuestions();

  let songsMoved = 0;
  if (res.unsortedMusicPath) {
    songsMoved = sort(res.unsortedMusicPath, ['.mp3']);
  }
  console.log('Finished.');
  console.log(`Songs Moved: ${songsMoved}`);
}

main();
