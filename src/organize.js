const paths = require('./paths');
const sort = require('./utils/sort');
const Setttings = require('./utils/Settings');

const { removeEmptyDirsRecursively } = require('./utils/files');

async function organize() {
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
