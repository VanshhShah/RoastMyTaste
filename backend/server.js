const express = require("express");
const cors = require("cors");

const spotify = require("./spotify");
const getChessData = require("./chess");      
const generateRoast = require("./roast");
const getGithubData = require("./github");
const getValorantData = require("./valorant");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/login", spotify.login);
app.get("/callback", spotify.callback);

// ✅ ADD THIS HERE
app.get("/chess/:username", async (req, res) => {
  try {
    const data = await getChessData(req.params.username);
    const tone = req.query.tone || "Roast";
    
    const roast = await generateRoast({
      platform:"chess",
      username: req.params.username,
      rating: data.rapid_rating || data.blitz_rating,
      wins: data.wins,
      losses: data.losses,
      draws: data.draws,
      best: Math.max(
        data.blitz_rating,
        data.rapid_rating,
        data.bullet_rating
      ),
      mode: "chess",
    });

    res.json({ data, roast });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/github/:username", async (req, res) => {
  
  try {
    const data = await getGithubData(req.params.username);

    const roast = await generateRoast({
      platform: "github",
      username: data.username,
      followers: data.followers,
      following: data.following,
      repos: data.public_repos,
      stars: data.total_stars,
      bio: data.bio
    });

    res.json({ data, roast });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/valorant/:name/:tag", async (req, res) => {
  try {
    const tone = req.query.tone || "Roast";

    const data = await getValorantData(
      req.params.name,
      req.params.tag
    );

    const roast = await generateRoast({
      platform: "valorant",
      tone,
      ...data
    });

    res.json({ data, roast });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on 5000");
});