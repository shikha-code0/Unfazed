const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');

async function run() {
  const dbPath = __dirname + '/mongodb-data';
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath);
  }

  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbPath: dbPath,
      storageEngine: 'wiredTiger',
    },
    binary: {
      version: '4.0.28'
    }
  });

  console.log('MongoDB persistent memory server successfully started on ' + mongod.getUri());
  console.log('Keep this process running...');
}
run();
