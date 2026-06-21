const axios = require("axios");

async function getValorantData(name, tag) {
  try {
    const headers = { Authorization: process.env.HENRIK_API_KEY };

    const matchesRes = await axios.get(
      `https://api.henrikdev.xyz/valorant/v3/matches/ap/${encodeURIComponent(name.trim())}/${encodeURIComponent(tag.trim())}`,
      { headers }
    );

    const matches = matchesRes.data?.data || [];

    if (matches.length === 0) {
      return {
        username: `${name}#${tag}`,
        kd: "0.00", hs: "0.0", kills: 0,
        deaths: 0, assists: 0, acs: 0,
        streak: "0W-0L", agent: "Unknown"
      };
    }

    let totalKills = 0, totalDeaths = 0, totalAssists = 0;
    let totalScore = 0, totalRounds = 0;
    let totalHeadshots = 0, totalShots = 0;
    let wins = 0, losses = 0;
    const agentCounts = {};
    let matchesFound = 0;

    const targetName = name.trim().toLowerCase();
    const targetTag = tag.trim().toLowerCase();

    matches.slice(0, 5).forEach(match => {
      const allPlayers = match.players?.all_players || [];

      // CRITICAL FIX: Smart matching logic
      // Try exact name & tag first. If tag shifted (due to account changes), match by name alone.
      let p = allPlayers.find(
        x =>
          x.name?.toLowerCase() === targetName &&
          x.tag?.toLowerCase() === targetTag
      );

      if (!p) {
        p = allPlayers.find(x => x.name?.toLowerCase() === targetName);
      }

      // Fallback: If player name contains spaces or special characters parsed oddly
      if (!p) {
        p = allPlayers.find(x => x.name?.toLowerCase().replace(/\s+/g, '') === targetName.replace(/\s+/g, ''));
      }

      if (!p) return;
      matchesFound++;

      totalKills   += p.stats?.kills    || 0;
      totalDeaths  += p.stats?.deaths   || 0;
      totalAssists += p.stats?.assists  || 0;
      totalScore   += p.stats?.score    || 0;
      totalHeadshots += p.stats?.headshots || 0;
      totalShots   += (p.stats?.headshots || 0)
                    + (p.stats?.bodyshots  || 0)
                    + (p.stats?.legshots   || 0);

      totalRounds += match.metadata?.rounds_played || 22;

      // Fix: Title Case normalization for character names
      const agentRaw = p.character || "Unknown";
      const agent = agentRaw.charAt(0).toUpperCase() + agentRaw.slice(1).toLowerCase();
      agentCounts[agent] = (agentCounts[agent] || 0) + 1;

      const playerTeam = p.team;  // "Red" or "Blue"
      const redWon  = match.teams?.red?.has_won  === true;
      const blueWon = match.teams?.blue?.has_won === true;

      if ((playerTeam === "Red" && redWon) || (playerTeam === "Blue" && blueWon)) wins++;
      else losses++;
    });

    // If matching failed completely across loops, prevent division errors
    const mc = Math.max(matchesFound, 1);

    const agent = Object.keys(agentCounts).length > 0
      ? Object.keys(agentCounts).reduce((a, b) => agentCounts[a] > agentCounts[b] ? a : b)
      : "Unknown";

    return {
      username: `${name}#${tag}`,
      kd:     (totalKills / Math.max(totalDeaths, 1)).toFixed(2),
      hs:     ((totalHeadshots / Math.max(totalShots, 1)) * 100).toFixed(1),
      kills:  Math.round(totalKills   / mc),
      deaths: Math.round(totalDeaths  / mc),
      assists:Math.round(totalAssists / mc),
      acs:    Math.round(totalScore   / Math.max(totalRounds, 1)),
      streak: `${wins}W-${losses}L`,
      agent
    };

  } catch (err) {
    console.log("VAL ERROR:", err.response?.data || err.message);
    throw new Error("Invalid Valorant username/tag or API error");
  }
}

module.exports = getValorantData;
