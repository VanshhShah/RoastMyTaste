const axios = require("axios");

async function getChessData(username) {
  try {
    const res = await axios.get(
      `https://api.chess.com/pub/player/${username}/stats`
    );

    const blitz = res.data.chess_blitz || {};
    const rapid = res.data.chess_rapid || {};
    const bullet = res.data.chess_bullet || {};

    return {
      username,
      blitz_rating: blitz.last?.rating || 0,
      rapid_rating: rapid.last?.rating || 0,
      bullet_rating: bullet.last?.rating || 0,
      wins:
        (blitz.record?.win || 0) +
        (rapid.record?.win || 0) +
        (bullet.record?.win || 0),
      losses:
        (blitz.record?.loss || 0) +
        (rapid.record?.loss || 0) +
        (bullet.record?.loss || 0),
      draws:
        (blitz.record?.draw || 0) +
        (rapid.record?.draw || 0) +
        (bullet.record?.draw || 0),
    };
  } catch (err) {
    throw new Error("Invalid chess username");
  }
}

module.exports = getChessData;