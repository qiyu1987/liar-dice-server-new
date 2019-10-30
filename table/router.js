const { Router } = require('express')
const Sse = require('json-sse')
const router = new Router()
const stream = new Sse()
const Table = require('./model')
const authMiddleware = require('../auth/middleware')
const { toData } = require("../auth/jwt");
// get all tables as a list
router.get('/lobby', 
    (req, res, next) => {
        Table.findAll()
            .then( 
                tables => res.send(tables)
            )
            .catch(next)
    }
)
// get one table
router.get('/table/:id',
    async (req, res) => {
        const table = await Table.findByPk(req.params.id, { include: [{all:true}] })
        const data = JSON.stringify(table)
        stream.updateInit(data)
        stream.init(req, res)
    }
)
//create a table
router.post('/lobby', 
    (req, res, next) => {
        console.log('request post /lobby')
        console.log(req.body)
        Table.create({...req.body, status: 'empty'})
            .then(table => res.json(table))
            .catch(next)
    }
)
// join a table
router.put('/table/:id/join', authMiddleware, 
    (req, res, next) => {
        console.log(`get a request on put /table/${req.params.id}/join`)
        const auth =
        req.headers.authorization && req.headers.authorization.split(" ");
        const data = toData(auth[1])
        console.log('what is the data out of token',data)
        Table.findByPk(req.params.id)
        .then(table => {
          if (table) {
            switch (table.status) {
                case 'empty':
                    table.update({ status:'waiting', player1Id:data.userId })
                    .then(res.send(table))
                case 'waiting':
                    if (table.player1Id!==data.userId)
                    {
                        table.update({ status:'playing', player2Id:data.userId })
                        .then(res.send(table))
                    } else {
                        res.send('You already joined the table')
                    }
                default:
                    res.send('Table not available')
            }
          } else {
            res.status(404).end();
          }
        })
        .catch(next);
    }
)
// start a game --> req.body = {diceRoll1:'12345',diceRoll2:'54321'}
router.put('/table/:id/start', async (req, res) => {
    const table = await Table.findByPk(req.params.id)
    if (table) {
        const {player1Id} = table
        table.update({...req.body, turnId: player1Id})
        const data = JSON.stringify(table)
        stream.send(data)
        res.send(data)
    } else {
        res.status(404).end()
    }
})
// place a bid --> req.body = {bidNumber:1,bidDiceType:'3'}
router.put('/table/:id/bid', async (req, res) => {
    console.log(`a bid is placed on table ${req.params.id}`)
    const table = await Table.findByPk(req.params.id)
    if (table){
        const {turnId, player1Id, player2Id} = table
        const newTurnId = turnId === player1Id ? player2Id : player1Id
        table.update({...req.body, turnId: newTurnId})
        const data = JSON.stringify(table)
        stream.send(data)
        res.send(data)
    } else {
        res.status(404).end()
    }
})
// challenge
router.put('table/:id/challenge', (req, res, next) => {
    Table.findByPk(req.params.id)
        .then(table => {
            if (table) {
                table.update({status:'done', })
            } else {
                res.status(404).end()
            }
        })
})
module.exports = router

