const os = require('os');
const fs = require('fs');
const prompts = require('prompts');

const paths = require('./paths');
const Settings = require('./utils/Settings');

const {
  getUnsortedMusicPathChoices,
  getSortedMusicPathChoices,
  getSongFormatChoices
} = require('./utils/choices');

async function askQuestions() {
  const settings = new Settings(paths.setupSettings);
  const homeDir = os.homedir();
  const questions = [
    {
      message: 'Choose your file naming format.',
      type: 'select',
      name: 'fileformat',
      choices: getSongFormatChoices(settings.get())
    },
    {
      type: (prev) => {
        return prev == 'Custom' ? 'text' : null;
      },
      message:
        'Specify the format to name your files. Only use the following variables: <Number> || <Song> || <Album> || <Artist> and only use - or _ as separators.',
      validate: (value) =>
        value
          .replace('-', '')
          .replace('_', '')
          .replace('<Number>', '')
          .replace('<Song>', '')
          .replace('<Album>', '')
          .replace('<Artist>', '')
          .trim() === ''
          ? true
          : "Input doesn't match the criteria"
    },
    {
      message: 'Where is your unsorted music?',
      type: 'autocomplete',
      name: 'unsortedMusicPath',
      choices: getUnsortedMusicPathChoices(settings.get()),
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
      choices: getSortedMusicPathChoices(settings.get()),
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

async function main() {
  const settings = new Settings(paths.setupSettings);
  const responses = await askQuestions();

  settings.addTo(responses);
  settings.write();

  return responses;
}

main()
  .catch((e) => {
    throw Error(`Music Organizer setup failed due to: ${e}`);
  })
  .then(() => {
    console.log('Setup Complete. You are now ready to organize!');
  });
