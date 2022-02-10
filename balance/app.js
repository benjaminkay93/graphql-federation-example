const express = require('express')
const app = express()
const balance = require('./routes/balance');
const port = 5571

app.use(express.json());
app.use('/balance', balance);
app.get('/', (req, res) => {
  console.log('request is here: balance')
  res.send('200 OK - balance api')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})