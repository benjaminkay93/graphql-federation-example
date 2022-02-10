const matchParser = ({match, matchId, puuid}) => {

  const startTime = new Date(match.matchInfo.gameStartMillis)
  const player = match.players.find(({puuid: matchPuuid}) => matchPuuid === puuid)
  const playerTeam = player.teamId
  const winningTeam = match.teams.find(team => team.won).teamId
  const playerDidWin = playerTeam === winningTeam

  const byRound = match.roundResults.map(round=> {
    const playerStatsInRound = round.playerStats.find(({puuid: matchPuuid}) => matchPuuid === puuid)

    return {
      roundNum: round.roundNum,
      kills: playerStatsInRound.kills.length,
      damage: playerStatsInRound.damage.reduce((acc, val) => acc + val.damage, 0),
      headshots: playerStatsInRound.damage.reduce((acc, val) => acc + val.headhots, 0),
      bodyshots: playerStatsInRound.damage.reduce((acc, val) => acc + val.bodyshots, 0),
      legshots: playerStatsInRound.damage.reduce((acc, val) => acc + val.legshots, 0),
    }
  })
  return {
    matchId,
    startTime: startTime.toISOString(),
    isRanked: match.matchInfo.isRanked,
    isCompleted: match.matchInfo.isCompleted,
    player: player.stats,
    teams: match.teams,
    playerTeam,
    winningTeam,
    playerDidWin,
    byRound
  }
}

module.exports = matchParser;
