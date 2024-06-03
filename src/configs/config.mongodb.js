// Levels 0
// const config = {
//   app: {
//     port: 3000
//   },
//   db: {
//     host: localhost,
//     port: 27017,
//     name: db
//   }
// }

// Levels 1
const dev = {
  app: {
    port: 3000
  },
  db: {
    username: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    name: process.env.DEV_DBNAME
  }
}

const prod = {
  app: {
    port: 3000
  },
  db: {
    username: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    name: process.env.PROD_DBNAME
  }
}

const config = {dev, prod}
const env = process.env.NODE_ENV || 'dev'
module.exports = config[env];