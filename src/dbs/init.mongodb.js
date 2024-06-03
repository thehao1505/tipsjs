const mongoose = require('mongoose');
const { countConnect } = require('../helper/check.connect');
// const { db: { host, name, port }} = require('../configs/config.mongodb')
// const connectStr = `mongodb://localhost${host}:27017${port}/shopDEV${name}`
const { db: { username, password, name }} = require('../configs/config.mongodb')
const connectStr = `mongodb+srv://${username}:${password}@cluster0.cmittl2.mongodb.net/${name}`

class Database {
  constructor() {
    this.connect();
  }

  connect(type = 'mongodb') {
    if (true) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }

    mongoose.connect(connectStr, {
      maxPoolSize: 50
    }).then( _ =>
      console.log(`Connected Mongodb Success!`, countConnect())
    );
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;