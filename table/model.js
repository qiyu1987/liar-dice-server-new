const Sequelize = require('sequelize');
const db = require('../db');
const User = require('../user/model');
const Table = db.define('table', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: Sequelize.ENUM('empty', 'waiting', 'playing', 'done'),
    defaultValue: 'empty'
  },
  bidNumber: {
      type: Sequelize.INTEGER
    },
  bidDiceType: {
      type: Sequelize.ENUM('1','2','3','4','5','6')
    }
});

Table.belongsTo(User, { as: 'turn', constraints: false });
Table.belongsTo(User, { as: 'player1', constraints: false });
Table.belongsTo(User, { as: 'player2', constraints: false });
Table.belongsTo(User, { as: 'winner', constraints: false });
module.exports = Table;
