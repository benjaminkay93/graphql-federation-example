const express = require('express');
const router = express.Router();

const matchParser = require('../libs/match-parser')

const userInfoReq = require('./blobs/user-info')
const activeShardsReq = require('./blobs/active-shards')
const matchHistory = require('./blobs/match-history')
const matchExample = require('./blobs/match-example')

router.get('/connect-user', function(req, res) {
  const {name, tag} = req.query
  console.log('QSParams:    ', {name, tag})

  // Request userinfo based on username
  // https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{name}}/{tag}?api_key=

  const {puuid} = userInfoReq

  console.log('puuid:       ', puuid)

  // Use puuid to fetch active shards
  // https://americas.api.riotgames.com/riot/account/v1/active-shards/by-game/val/by-puuid/{puuid}?api_key=
  const activeShards = [activeShardsReq.activeShard]

  console.log('activeShards:', activeShards)

  const response = activeShards.map(shard => {
    // Fetch game history on first connect
    // https://{shard}.api.riotgames.com/val/match/v1/matchlists/by-puuid/{puuid?api_key=
    
    const previousMatches = matchHistory.history.map(data => {
      const ts = new Date(data.gameStartTime)
      console.log('Game Found:  ', shard, ts.toISOString(), data.matchId)
      return data
    })

    // Fetch match data for each previous game known
    // just pretend to look at one match ;)
    const refinedMatchHistoryForShard = [previousMatches[0]].map(({matchId}) => {
      // Fetch match details
      // https://{shard}.api.riotgames.com/val/match/v1/matches/{matchId}?api_key=
      // in this case matchExample is the response
      return matchParser({match: matchExample, matchId, puuid})
    })

    return {shard, refinedMatchHistoryForShard}
  })

  console.log('request to /valorant/connect-user', {name, tag})
  
  res.send(response);
});


router.post('/update-user', function(request, response) {
  const {name, tag} = request.body
  console.log('request to /valorant/update-user', {name, tag})
  response.send(request.body);
});

module.exports = router;
