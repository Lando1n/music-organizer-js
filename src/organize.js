const chalk = require('chalk');

const paths = require('./paths');
const sort = require('./utils/sort');
const Setttings = require('./utils/Settings');

const { removeEmptyDirsRecursively } = require('./utils/files');

function printTitle() {
  console.log(
    chalk.blue(`  
  ╔╗              ╔╗     ╔╗     
  ║║              ║║    ╔╝║     
  ║║   ╔══╗ ╔═╗ ╔═╝║╔══╗╚╗║ ╔═╗ 
  ║║ ╔╗╚ ╗║ ║╔╗╗║╔╗║║╔╗║ ║║ ║╔╗╗
  ║╚═╝║║╚╝╚╗║║║║║╚╝║║╚╝║╔╝╚╗║║║║
  ╚═══╝╚═══╝╚╝╚╝╚══╝╚══╝╚══╝╚╝╚╝`)
  );
  console.log(
    chalk.rgb(
      255,
      165,
      0
    )(`
  MUSIC ORGANIZER JS, VERSION: ${require('../package.json').version}
  ------------------------------------
  `)
  );
}

async function organize() {
  printTitle();

  const settings = new Setttings(paths.setupSettings);

  if (!settings.exists() || !settings.validate()) {
    throw Error('Please run setup before trying to organize!');
  }

  const songsMoved = await sort(
    settings.get().unsortedMusicPath,
    settings.get().sortedMusicPath,
    settings.get().fileformat
  );

  if (settings.get().cleanup) {
    removeEmptyDirsRecursively(settings.get().unsortedMusicPath);
  }

  return songsMoved;
}

module.exports = {
  organize
};
