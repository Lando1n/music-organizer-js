const os = require('os');
const fs = require('fs');
const path = require('path');

const prompts = require('prompts');
const sort = require('./utils/sort');
const { cacheAnswers, getAnswerCache } = require('./utils/answerCaching');
const {
  getUnsortedMusicPathChoices,
  getSortedMusicPathChoices
} = require('./utils/choices');

async function askQuestions(answerCache = {}) {
  const homeDir = os.homedir();

  const questions = [
    {
      message: 'Where is your unsorted music?',
      type: 'autocomplete',
      name: 'unsortedMusicPath',
      choices: getUnsortedMusicPathChoices(answerCache),
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
      choices: getSortedMusicPathChoices(answerCache),
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

  let responses = await prompts(questions);

  if (responses.confirm) {
    console.log("Ok, let's try again then");
    responses = await askQuestions();
  }

  return responses;
}

async function main() {
  const answerCache = getAnswerCache();
  const responses = await askQuestions(answerCache);
  cacheAnswers(responses);

  let songsMoved = 0;
  if (responses.unsortedMusicPath) {
    songsMoved = sort(responses.unsortedMusicPath, responses.sortedMusicPath, [
      '.mp3'
    ]);
  }
  console.log('Finished.');
  console.log(`Songs Moved: ${songsMoved}`);
}

main();
