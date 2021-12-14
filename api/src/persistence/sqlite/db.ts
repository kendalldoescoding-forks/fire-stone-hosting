import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const db = open({
  filename: './database.sqlite',
  driver: sqlite3.Database,
}).then(dbObj => {
  const db = dbObj;
  // db.run('DROP TABLE IF EXISTS `users`');
  // db.run('DROP TABLE IF EXISTS `nodes`');
  // db.run('DROP TABLE IF EXISTS `servers`');
  db.run(
    'CREATE TABLE IF NOT EXISTS `users` (id VARCHAR(255) PRIMARY KEY, email VARCHAR(255), password VARCHAR(255), UNIQUE(email))',
  );
  db.run(
    'CREATE TABLE IF NOT EXISTS `nodes` (`id` VARCHAR(255) PRIMARY KEY, `ip` VARCHAR(255), `totalMemory` INT, `freeMemory` INT)',
  );
  db.run(
    'CREATE TABLE IF NOT EXISTS `servers` (`id` VARCHAR(255) PRIMARY KEY, `nodeId` INT NOT NULL, `port` INIT, `memory` INT, `cpuPercent` VARCHAR(255), `memoryPercent` VARCHAR(255), `restart` BOOL, `running` BOOL, `runBackup` BOOL, `userId` INT, `version` VARCHAR(255))',
  );
  return db;
});
