const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')
const url = 'mongodb://localhost/library'
const uuidv4 = require('uuid/v4')

app.use(bodyParser.json())

app.get('/note', (req, res) => {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.error(err)
      res.sendStatus(500)
      process.exit(1)
    }
    db.collection('note')
      .find({})
      .toArray()
      .then((contents) => res.json(contents))
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
      .then(() => db.close())
  })
})

app.post('/note', (req, res) => {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.error(err)
      res.sendStatus(500)
      process.exit(1)
    }
    db.collection('note')
      .insertOne(req.body)
      .then(() => res.sendStatus(201))
      .catch((err) => {
        console.error(err)
        res.sendStatus(400)
      })
      .then(() => db.close())
  })
})

app.put('/note/:id', (req, res) => {
  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.error(err)
      res.sendStatus(500)
      process.exit(1)
    }
    const noteId = parseInt(req.params.id, 10)
    /*
    const content = req.body.find(content => {
      return content.id === noteId
    })
    if (!content) {
      return res.sendStatus(404)
    }
    Object.assign({}, req.body, { id: uuidv4() })
    */
    db.collection('note')
      .updateOne(noteId, { $set: req.body })
      .then(() => res.sendStatus(200))
      .catch((err) => {
        console.error(err)
        res.sendStatus(400)
      })
      .then(() => db.close())
  })
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
