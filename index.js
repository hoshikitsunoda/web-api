const express = require('express')
const { MongoClient } = require('mongodb')
const url = 'mongodb://localhost/library'
const uuidv4 = require('uuid/v4')

MongoClient.connect(url, (err, db) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  const app = express()
  const bodyParser = require('body-parser')
  app.use(bodyParser.json())
  const notes = db.collection('note')

  app.get('/note', (req, res) => {
    notes
      .find({})
      .toArray()
      .then((contents) => res.json(contents))
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  })
  app.post('/note', (req, res) => {
    notes
      .insertOne(Object.assign({ _id: uuidv4() }, req.body))
      .then(() => res.sendStatus(201))
      .catch((err) => {
        console.error(err)
        res.sendStatus(400)
      })
  })
  app.put('/note/:id', (req, res) => {
    const noteId = { _id: req.params.id }
    notes
      .updateOne(noteId, { $set: req.body })
      .then(() => res.sendStatus(200))
      .catch((err) => {
        console.error(err)
        res.sendStatus(400)
      })
  })
  app.delete('/note/:id', (req, res) => {
    const noteId = { _id: req.params.id }
    notes
      .deleteOne(noteId)
      .then(() => res.sendStatus(204))
      .catch((err) => {
        console.error(err)
        res.sendStatus(400)
      })
  })
  app.listen(3000, () => {
    console.log('Listening on port 3000')
  })
})
