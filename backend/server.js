const express = require("express");
const cors = require("cors");

const spotify = require("./spotify");
const getChessData = require("./chess");       // ✅ added
const generateRoast = require("./roast");      // ✅ added

const app = express();

app.use(cors());
app.use(express.json());

app.get("/login", spotify.login);
app.get("/callback", spotify.callback);

// ✅ ADD THIS HERE
app.get("/chess/:username", async (req, res) => {
  try {
    const data = await getChessData(req.params.username);

    const roast = await generateRoast({
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

app.listen(5000, () => {
  console.log("Server running on 5000");
});