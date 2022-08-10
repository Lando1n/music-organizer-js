const os = require('os');
const fs = require('fs');
const path = require('path');
const prompts = require('prompts');

const sort = require('./utils/sort');
const Cache = require('./utils/Cache');
const {
  getUnsortedMusicPathChoices,
  getSortedMusicPathChoices
} = require('./utils/choices');
const { removeEmptyDirsRecursively } = require('./utils/files');

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
      ['.mp3', '.flac']
    );
  }

  if (responses.cleanup) {
    removeEmptyDirsRecursively(responses.unsortedMusicPath);
  }

  return songsMoved;
}

async function main() {
  const cache = new Cache(
    path.join(__dirname, '..', '.music-organizer-cache.json')
  );
  const answerCache = cache.get();

  if (answerCache === {}) {
    console.log('Welcome to Music Organizer JS!\n');
    console.log(
      "I'm under the impression that you're a first timer. Happy to have you.\n"
    );
    console.log(
      "Just answer the prompts honestly, and we won't have any problems."
    );
  }

  let useCache = false;
  if (cache.validate()) {
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
        name: 'useCache',
        choices: [
          { title: 'Yes', value: true },
          { title: 'No', value: false }
        ]
      }
    ]);
    useCache = res.useCache;
  }

  const responses = useCache ? answerCache : await askQuestions(answerCache);
  cache.addTo(responses);

  const songsMoved = await runResponses(responses);

  if (songsMoved === 0) {
    console.warn(
      "It appears I haven't moved any files, you sure that is the directory you're looking for?\n"
    );
  } else {
    console.log('Finished.');
    console.log(`Songs Moved: ${songsMoved}`);
  }
  cache.write();
}

main()
  .catch((e) => {
    throw Error(`Music Organizer failed due to: ${e}`);
  })
  .then(() => {
    console.log('Complete.');
  });
