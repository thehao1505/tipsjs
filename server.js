const app = require('./src/app');

const PORT = process.env.PORT || 4444

const server = app.listen(PORT, () => {
  console.log(`Learning start with ${PORT}`)
}) 

process.on('SIGINT', () => {
  server.close(() => console.log(`Exit server express!`))
})