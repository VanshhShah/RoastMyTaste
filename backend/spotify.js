const axios = require("axios");
require("dotenv").config();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = "http://localhost:5000/callback";

exports.login = (req, res) => {

const scope = "user-top-read";

const url =
"https://accounts.spotify.com/authorize" +
"?response_type=code" +
"&client_id=" + client_id +
"&scope=" + scope +
"&redirect_uri=" + redirect_uri;

res.redirect(url);

};

exports.callback = async (req, res) => {

const code = req.query.code;

const token = await axios.post(
"https://accounts.spotify.com/api/token",
new URLSearchParams({
grant_type: "authorization_code",
code: code,
redirect_uri: redirect_uri
}),
{
headers: {
Authorization:
"Basic " +
Buffer.from(client_id + ":" + client_secret).toString("base64"),
"Content-Type": "application/x-www-form-urlencoded"
}
}
);

const access_token = token.data.access_token;

// get top artists
const artists = await axios.get(
"https://api.spotify.com/v1/me/top/artists",
{
headers: {
Authorization: "Bearer " + access_token
}
}
);

// get top tracks
const tracks = await axios.get(
"https://api.spotify.com/v1/me/top/tracks",
{
headers: {
Authorization: "Bearer " + access_token
}
}
);

const artistNames = artists.data.items
.slice(0,5)
.map(a => a.name)
.join(", ");

const trackNames = tracks.data.items
.slice(0,5)
.map(t => t.name)
.join(", ");

const genres = artists.data.items
.flatMap(a => a.genres)
.slice(0,5)
.join(", ");

res.json({
artists: artistNames,
tracks: trackNames,
genres: genres
});

};