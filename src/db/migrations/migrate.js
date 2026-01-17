import db from '../db.js';
import changelog_0 from './changelog_0.js';
import changelog_1 from './changelog_1.js';

const changelogMap = {
  ['changelog_0']: changelog_0,
  ['changelog_1']: changelog_1,
};

export const migrate = (fromChangelog) => {
  const database = db.get();
  const changelogKeys = Object.keys(changelogMap);

  const startChangelogIdx = fromChangelog
    ? changelogKeys.indexOf(fromChangelog)
    : 0;

  if (!fromChangelog && startChangelogIdx === 0) {
    console.warn('Changelog was not provided. All changelogs are executed!\n');
  }

  if (fromChangelog && startChangelogIdx === -1) {
    console.error('Invalid changelog selected: ' + fromChangelog);

    database.close();
    return;
  }

  const toExecuteChangelogKeys = changelogKeys.slice(startChangelogIdx);

  toExecuteChangelogKeys.forEach((key) => changelogMap[key].execute(database));

  database.close();
};
