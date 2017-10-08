const express = require('express')
const app = express()
var bodyParser = require('body-parser')

app.use(bodyParser.json())

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
