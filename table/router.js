const { Router } = require('express')
const router = new Router()
const Table = require('./model')
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
router.post('/lobby',
    (req, res, next) => {
        console.log('request post /lobby')
        console.log(req.body)
        Table.create({...req.body, status: 'empty'})
            .then(table => res.json(table))
            .catch(next)
    }
)
module.exports = router