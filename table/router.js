const { Router } = require('express')
const router = new Router()
const Table = require('./model')
const authMiddleware = require('../auth/middleware')
const { toData } = require("../auth/jwt");
router.get('/lobby', 
    (req, res, next) => {
        Table.findAll()
            .then( 
                tables => res.send(tables)
            )
            .catch(next)
    }
)
router.get('/table/:id',
    (req, res, next) => {
        Table.findByPk(req.params.id)
        .then(table => {
          res.send(table);
        })
        .catch(next);
    }
)
router.post('/lobby', authMiddleware,
    (req, res, next) => {
        console.log('request post /lobby')
        console.log(req.body)
        Table.create({...req.body, status: 'empty'})
            .then(table => res.json(table))
            .catch(next)
    }
)
router.put('/table/:id', authMiddleware, 
    (req, res, next) => {
        console.log(`get a request on put /table/${req.params.id}`)
        const auth =
        req.headers.authorization && req.headers.authorization.split(" ");
        const data = toData(auth[1])
        console.log('what is the data out of token',data)
        Table.findByPk(req.params.id)
        .then(table => {
          if (table) {
            switch (table.status) {
                case 'empty':
                    table.update({ status:'waiting', Player1Id:data.userId })
                    .then(res.send(table))
                case 'waiting':
                    if (table.Player1Id!==data.userId)
                    {
                        table.update({ status:'playing', Player2Id:data.userId })
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
module.exports = router

