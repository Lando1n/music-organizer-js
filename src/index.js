const os = require('os');
const fs = require('fs');
const prompts = require('prompts');

const sort = require('./utils/sort');
const {
  cacheAnswers,
  getAnswerCache,
  validateCache
} = require('./utils/answerCaching');
const {
  getUnsortedMusicPathChoices,
  getSortedMusicPathChoices
} = require('./utils/choices');
const { removeEmptyDirsRecursively } = require('./utils/cleanupDirs');

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
      name: 'cleanup',
      type: 'select',
      message: 'Would you like to remove empty directories?',
      choices: [
        {
          title: 'Yes',
          value: true
        },
        {
          title: 'No',
          value: false
        }
      ]
    },
    {
      name: 'confirm',
      type: 'select',
      message: (prev, values) =>
        `Please confirm: You would like to sort music from ${
          values.unsortedMusicPath
        } to ${values.sortedMusicPath} || ${
          values.cleanup
            ? 'And cleanup empty directories'
            : 'Do not cleanup empty directories'
        }`,
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

  const responses = await prompts(questions);

  if (responses.confirm) {
    console.log("Ok, let's try again then! Try not to mess up this time, eh.");
    responses = await askQuestions();
  }

  return responses;
}

async function runResponses(responses) {
  let songsMoved = 0;
  if (responses.unsortedMusicPath) {
    songsMoved = await sort(
      responses.unsortedMusicPath,
      responses.sortedMusicPath,
      ['.mp3']
    );
  }

  if (responses.cleanup) {
    removeEmptyDirsRecursively(responses.unsortedMusicPath);
  }

  return songsMoved;
}

async function main() {
  const answerCache = getAnswerCache();
  const isCacheValid = validateCache();
  let runCache = false;
  if (isCacheValid) {
    const res = await prompts([
      {
        message: `Run with your previous settings? ${
          answerCache.unsortedMusicPath
        } >> ${answerCache.sortedMusicPath} || ${
          answerCache.cleanup
            ? 'And cleanup empty directories'
            : 'Do not cleanup empty directories'
        }`,
        type: 'select',
        name: 'runCache',
        choices: [
          { title: 'Yes', value: true },
          { title: 'No', value: false }
        ]
      }
    ]);
    runCache = res.runCache;
  }

  let responses;
  if (runCache) {
    responses = answerCache;
  } else {
    responses = await askQuestions(answerCache);
    cacheAnswers(responses);
  }

  return runResponses(responses);
}

main()
  .catch((e) => {
    throw Error(`Music Organizer failed due to: ${e}`);
  })
  .then((songsMoved) => {
    console.log('Finished.');
    console.log(`Songs Moved: ${songsMoved}`);
  });
