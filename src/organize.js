const paths = require('./paths');
const sort = require('./utils/sort');
const Setttings = require('./utils/Settings');

const { removeEmptyDirsRecursively } = require('./utils/files');

async function main() {
  const settings = new Setttings(paths.setupSettings);

  if (!settings.exists() || !settings.validate()) {
    console.warn('Please run setup before trying to organize! (npm run setup)');
    return;
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

main()
  .catch((e) => {
    throw Error(`Music Organizer failed due to: ${e}`);
  })
  .then((songsMoved) => {
    if (songsMoved === 0) {
      console.warn(
        "It appears I haven't moved any files, you sure that is the directory you're looking for? Maybe consider running setup again.\n"
      );
    } else {
      console.log(`Songs Moved: ${songsMoved}`);
    }
    console.log('Complete.');
  });
