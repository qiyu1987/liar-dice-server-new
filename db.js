const Sequelize = require('sequelize');
const databaseURL =
  process.env.DATABASE_URL ||
  'postgres://postgres:secret@localhost:5432/postgres';
const db = new Sequelize(databaseURL);
db.sync({force:true})
  .then(() => console.log('Database connected'))
  .catch(error => console.error);

module.exports = db;
