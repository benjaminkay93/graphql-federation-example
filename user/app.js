const express = require('express')
const app = express()
const user = require('./routes/user');
const port = 5561

app.use(express.json());
app.use('/user', user);
app.get('/', (req, res) => {
  console.log('request is here: user')
  res.send('user api')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})