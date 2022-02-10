const express = require('express');
const router = express.Router();

router.get('/:userId', (request, response) => {
  console.log('USER RE REQUESTD!!!!!')
  response.send({
    id: request.params.userId,
    username: 'abcdefg',
  })
})

router.post('/update/:userId', (request, response) => {
  const {username} = request.body

  const responseBody = {
    id: request.params.userId,
    username: username,
  }

  console.log(responseBody)
  
  response.send(responseBody);
});

module.exports = router;
