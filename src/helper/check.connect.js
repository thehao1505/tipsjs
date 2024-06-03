const mongoose = require('mongoose')
const _SECOND = 5000;
const os = require('os')
const process = require('process')
// Count Connect
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connection: ${numConnection}`)
}

// Check overload
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Ex: Maximum number of connections based on number of cores
    const maxConnection = numCores*5;

    console.log(`Active connections: ${numConnection}`)
    console.log(`Memory usage: ${ memoryUsage / 1024 / 1024} MB`)

    if (numConnection > maxConnection) {
      console.log(`Connection overload detected!`)
    }
  }, _SECOND)
}

module.exports = {
  checkOverload,
  countConnect
}