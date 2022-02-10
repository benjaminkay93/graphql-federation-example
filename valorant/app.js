const express = require('express')
const app = express()
const valorant = require('./routes/valorant');
const port = 5551

app.use(express.json());
app.use('/valorant', valorant);
app.get('/', (req, res) => {
  console.log('request is here: valorant')
  res.send('valorant api')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})