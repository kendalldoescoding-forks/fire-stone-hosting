const express = require('express');
const sqlite = require('sqlite');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const uuidv4 = require('uuid/v4');

let db;

const persistence = {
  getServersForUser: async ({ userId }) => db.all('SELECT * from `servers` JOIN `nodes` ON `servers`.`nodeId` = `nodes`.`id` WHERE `userId` = ?', [userId]),
};

app.get('/nodes', async (req, res) => {
  const rows = await db.all('SELECT * from `nodes`');
  return res.send(rows);
});

app.get('/nodes/:nodeId/servers', async (req, res) => {
  const { nodeId } = req.params;
  const rows = await db.all('SELECT * from `servers` WHERE `nodeId` = ?', [nodeId]);
  return res.send(rows);
});

const getServersForUser = require('./getServersForUser.interactor');

app.get('/users/:userId/servers', async (req, res) => {
  const { userId } = req.params;
  console.log('userId', userId);
  const servers = await getServersForUser({ userId, persistence });
  return res.send(servers);
});

app.post('/nodes', async (req, res) => {
  const {
    nodeId,
    ip,
    totalMemory,
    freeMemory,
  } = req.body;
  const nodeStmt = await db.prepare('REPLACE INTO `nodes` (`id`, `ip`, `total_memory`, `free_memory`) VALUES (?, ?, ?, ?)');
  await nodeStmt.run(nodeId, ip, totalMemory, freeMemory);
  await nodeStmt.finalize();
  return res.send('node registered');
});

app.post('/servers/:serverId/stop', async (req, res) => {
  const { serverId } = req.params;
  const nodeStmt = await db.prepare('UPDATE `servers` SET `running` = ? WHERE `id` = ?');
  await nodeStmt.run(false, serverId);
  await nodeStmt.finalize();
  return res.send('server stopped');
});

app.post('/servers/:serverId/start', async (req, res) => {
  const { serverId } = req.params;
  const nodeStmt = await db.prepare('UPDATE `servers` SET `running` = ? WHERE `id` = ?');
  await nodeStmt.run(true, serverId);
  await nodeStmt.finalize();
  return res.send('server stopped');
});


app.post('/purchase/cb', async (req, res) => {
  const userId = 'abc';
  const { memory } = req.body;
  const nodes = await db.all('SELECT * from `nodes`');
  const desiredNode = nodes.find(node => node.free_memory > memory);

  if (!desiredNode) {
    return res.send('no avaiable nodes', 500);
  }

  const servers = await db.all('SELECT * from `servers` WHERE nodeId = ?', desiredNode.id);
  let freePort = 25565;
  if (servers.length) {
    const ports = servers.map(s => s.port).sort();
    freePort = ports[ports.length - 1] + 1;
  }

  let stmt = await db.prepare('UPDATE `nodes` SET `free_memory` = ? WHERE `id` = ?');
  await stmt.run(desiredNode.free_memory - memory, desiredNode.id);
  await stmt.finalize();

  stmt = await db.prepare('INSERT INTO `servers` (`id`, `nodeId`, `port`, `memory`, `running`, `userId`) VALUES (?, ?, ?, ?, ?, ?)');
  await stmt.run(uuidv4(), desiredNode.id, freePort, memory, true, userId);
  await stmt.finalize();
  return res.send('server renting');
});

sqlite.open('./database.sqlite').then((dbObj) => {
  db = dbObj;
  db.run('DROP TABLE IF EXISTS `users`');
  db.run('DROP TABLE IF EXISTS `nodes`');
  db.run('DROP TABLE IF EXISTS `servers`');
  db.run('CREATE TABLE IF NOT EXISTS `users` (email TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS `nodes` (`id` VARCHAR(255) PRIMARY KEY, `ip` VARCHAR(255), `total_memory` INT, `free_memory` INT)');
  db.run('CREATE TABLE IF NOT EXISTS `servers` (`id` VARCHAR(255) PRIMARY KEY, `nodeId` INT NOT NULL, `port` INIT, `memory` INT, `running` BOOL, `userId` INT)');
  app.listen(3333);
});
