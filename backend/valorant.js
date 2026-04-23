const axios = require("axios");

async function getValorantData(name, tag) {
  try {
    const headers = {
      Authorization: process.env.HENRIK_API_KEY
    };

    // account info
    const accountRes = await axios.get(
      `https://api.henrikdev.xyz/valorant/v2/account/${name}/${tag}`,
      { headers }
    );

    // mmr info
    const mmrRes = await axios.get(
      `https://api.henrikdev.xyz/valorant/v2/mmr/ap/${name}/${tag}`,
      { headers }
    );

    const account = accountRes.data.data;
    const mmr = mmrRes.data.data;

    return {
      username: `${name}#${tag}`,
      level: account?.account_level || "Unknown",
      rank: mmr.currenttierpatched,
      rr: mmr.ranking_in_tier,
      elo: mmr.elo
    };
  } catch (err) {
    console.log(err.response?.data || err.message);

    if (err.response?.data?.errors?.[0]?.code === 24) {
    throw new Error("Play one Valorant match first, then try again.");
  }

    throw new Error("Invalid Valorant username/tag");
  }
}

module.exports = getValorantData;