const Sequelize = require('sequelize')
const db = require('../db')
const User = require('../user/model')
const Table = db.define('table', {
    name:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    status:{
        type: Sequelize.ENUM('empty','waiting','playing','done'),
        defaultValue: 'empty'
    },
}
)
Table.belongsTo(User, {as : "Player1", constraints: false})
Table.belongsTo(User, {as : "Player2", constraints: false})
Table.belongsTo(User, {as : "Winner", constraints: false})
module.exports = Table