const os = require('os');
const _ = require('lodash');
const path = require('path');

function getSongFormatChoices(answerCache) {
  const previous = _.get(answerCache, 'fileformat')
    ? [
        {
          value: _.get(answerCache, 'fileformat')
        }
      ]
    : [];
  const choices = _.uniqWith(
    previous.concat([
      { value: '<Song>' },
      { value: '<Number>-<Song>' },
      { value: '<Number>-<Song>-<Album>-<Artist>' },
      { value: 'Custom' }
    ]),
    _.isEqual
  );
  return choices;
}

function getUnsortedMusicPathChoices(answerCache) {
  const homeDir = os.homedir();
  const previousUnsortedPath = _.get(answerCache, 'unsortedMusicPath')
    ? [
        {
          title: _.get(answerCache, 'unsortedMusicPath')
        }
      ]
    : [];

  const choices = _.uniqWith(
    previousUnsortedPath.concat([
      {
        title: path.join(homeDir, 'Downloads')
      },
      {
        title: path.join(homeDir, 'Music')
      },
      {
        title: path.join(homeDir, 'Documents')
      }
    ]),
    _.isEqual
  );
  return choices;
}

function getSortedMusicPathChoices(answerCache) {
  const homeDir = os.homedir();
  const previousSortedPath = _.get(answerCache, 'sortedMusicPath')
    ? [
        {
          title: _.get(answerCache, 'sortedMusicPath')
        }
      ]
    : [];

  const choices = _.uniqWith(
    previousSortedPath.concat([
      {
        title: path.join(homeDir, 'Music')
      },
      {
        title: path.join(homeDir, 'Downloads')
      }
    ]),
    _.isEqual
  );
  return choices;
}

module.exports = {
  getUnsortedMusicPathChoices,
  getSortedMusicPathChoices,
  getSongFormatChoices
};
