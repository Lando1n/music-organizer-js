const os = require('os');
const _ = require('lodash');
const path = require('path');

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
      },
      {
        title: 'other'
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
      },
      {
        title: 'other'
      }
    ]),
    _.isEqual
  );
  return choices;
}

module.exports = { getUnsortedMusicPathChoices, getSortedMusicPathChoices };
