const axios = require("axios");

async function getValorantData(name, tag) {
  try {
    const headers = {
      Authorization: process.env.HENRIK_API_KEY
    };

    const matchesRes = await axios.get(
      `https://api.henrikdev.xyz/valorant/v3/matches/ap/${name}/${tag}`,
      { headers }
    );

    console.log("FULL RESPONSE:", JSON.stringify(matchesRes.data, null, 2));

    const matches = matchesRes.data?.data || [];

    console.log(JSON.stringify(matches[0], null, 2));

    if (matches.length === 0) {
      return {
        username: `${name}#${tag}`,
        kd: "Unknown",
        hs: "Unknown",
        kills: "Unknown",
        deaths: "Unknown",
        assists: "Unknown",
        acs: "Unknown",
        streak: "Unknown",
        agent: "Unknown"
      };
    }

    let totalKills = 0;
    let totalDeaths = 0;
    let totalAssists = 0;
    let totalScore = 0;
    let totalHeadshots = 0;
    let totalShots = 0;

    let wins = 0;
    let losses = 0;

    const agentCounts = {};

    matches.slice(0, 5).forEach(match => {
      const p = match.players?.all_players?.find(
        x => x.name.toLowerCase() === name.toLowerCase()
      );

      if (!p) return;

      totalKills += p.stats.kills;
      totalDeaths += p.stats.deaths;
      totalAssists += p.stats.assists;
      totalScore += p.stats.score;

      totalHeadshots += p.stats.headshots;
      totalShots +=
        p.stats.headshots +
        p.stats.bodyshots +
        p.stats.legshots;

      agentCounts[p.character] = (agentCounts[p.character] || 0) + 1;

      const winningTeam = match.teams?.red?.has_won ? "Red" : "Blue";

      if (p.team === winningTeam) wins++;
      else losses++;
    });

    const kd = (
      totalKills / Math.max(totalDeaths, 1)
    ).toFixed(2);

    const hs = (
      (totalHeadshots / Math.max(totalShots, 1)) * 100
    ).toFixed(1);

    const acs = Math.round(totalScore / 5);

    const kills = Math.round(totalKills / 5);
    const deaths = Math.round(totalDeaths / 5);
    const assists = Math.round(totalAssists / 5);

    const streak = `${wins}W-${losses}L`;

    const agent =
      Object.keys(agentCounts).length > 0
        ? Object.keys(agentCounts).reduce((a, b) =>
            agentCounts[a] > agentCounts[b] ? a : b
          )
        : "Unknown";

    return {
      username: `${name}#${tag}`,
      kd,
      hs,
      kills,
      deaths,
      assists,
      acs,
      streak,
      agent
    };

  } catch (err) {
    console.log("VAL ERROR:", err.response?.data || err.message);
    throw new Error("Invalid Valorant username/tag");
  }
}

module.exports = getValorantData;