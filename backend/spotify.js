const axios = require("axios");
require("dotenv").config();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

console.log("CLIENT:", client_id);
console.log("SECRET:", client_secret);

const redirect_uri = "http://127.0.0.1:5000/callback";
exports.login = (req, res) => {

const scope = "user-top-read";

const url =
"https://accounts.spotify.com/authorize" +
"?response_type=code" +
"&client_id=" + encodeURIComponent(client_id) +
"&scope=" + encodeURIComponent(scope) +
"&redirect_uri=" + encodeURIComponent(redirect_uri);

res.redirect(url);

};

exports.callback = async (req, res) => {
  try {
    const code = req.query.code;

    const token = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirect_uri,
      }).toString(),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(client_id + ":" + client_secret).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const access_token = token.data.access_token;
    console.log("ACCESS TOKEN:", access_token);

    // TEST 1: profile (this should NEVER fail)
    const me = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: "Bearer " + access_token },
    });

    console.log("USER:", me.data.display_name);

    // TEST 2: artists
    const artists = await axios.get(
      "https://api.spotify.com/v1/me/top/artists",
      {
        headers: { Authorization: "Bearer " + access_token },
      }
    );

    // TEST 3: tracks
    const tracks = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks",
      {
        headers: { Authorization: "Bearer " + access_token },
      }
    );

    res.json({
      artists: artists.data.items.map(a => a.name).join(", "),
      tracks: tracks.data.items.map(t => t.name).join(", "),
    });

  } catch (err) {
    console.log("ERROR DATA:", err.response?.data);
    console.log("ERROR STATUS:", err.response?.status);
    res.send("Error occurred. Check terminal.");
  }
};