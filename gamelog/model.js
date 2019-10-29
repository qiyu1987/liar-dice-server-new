const Sequelize = require('sequelize');
const db = require('../db');
const Table = require('../table/model')
const Gamelog = db.define('gamelog', {
    log: Sequelize.STRING
});
Gamelog.belongsTo(Table)

module.exports = Gamelog;