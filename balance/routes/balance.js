const express = require('express');
const router = express.Router();

router.get('/:userId', (request, response) => {
  response.send({
    id: request.params.userId,
    balance: Math.floor(Math.random() * 10000),
  })
})

router.post('/update/:userId', (request, response) => {
  const {balance} = request.body

  const responseBody = {
    id: request.params.userId,
    balance,
  }

  console.log(responseBody)
  
  response.send(responseBody);
});

module.exports = router;
