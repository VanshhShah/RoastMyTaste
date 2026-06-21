const axios = require("axios");

async function generateRoast(data) {
   const characterFocus = data.agent === "Unknown" 
    ? "an unknown character (they probably hide their profile out of shame)" 
    : data.agent;

  let prompt = "";

  if (data.platform === "valorant") {
    prompt = `
You are a toxic, hilarious Valorant teammate writing a roast about someone's ranked performance.
Write ONE savage, funny paragraph. No bullet points, no emojis, no headers.
Be specific — reference their exact stats, agent, and streak. Make it sting but funny.

Agent stereotypes to use in your roast:
- Jett / Reyna / Neon = ego fragger, instalock, blames team when they go 3/10
- Phoenix = thinks they're a 1v9 hero, dies every duel
- Iso = solo-minded, ignores teammates, shield means nothing at Iron rank
- Sage / Skye = healer main, passive, probably has "support diff" in every post-game chat
- Cypher / Killjoy / Chamber = plays behind util all game, has 0 entries, calls it "strategy"
- Omen / Brimstone / Astra / Clove = smokes mid from Spawn, never hits a molly, calls them setups
- Sova / Fade / Gekko / Breach = util player who forgets to actually shoot
- Viper = thinks they're Demon1, line-ups copied from YouTube, still loses
- Tejo / Vyse / Deadlock / Harbor = playing off-meta just to be different, it's not working
- Yoru = loves the mind games but can't win a straight duel
- KAY/O / Raze / Waylay = frag-focused, 0 util, expects carries

The player's actual stats:
- Username: ${data.username}
- Agent: ${data.agent}
- KD Ratio: ${data.kd} (below 1.0 = terrible, above 1.5 = decent, above 2.0 = sus/smurf)
- Headshot %: ${data.hs}% (below 15% = aim on floor, above 30% = actually good)
- Average Combat Score: ${data.acs} (below 150 = invisible, 200+ = decent, 250+ = impactful)
- Avg Kills per game: ${data.kills}
- Avg Deaths per game: ${data.deaths}
- Avg Assists per game: ${data.assists}
- Recent Match Streak: ${data.streak}
- Roast tone requested: ${data.tone || "Roast"}

Rules:
- Reference the agent by name and roast it based on the stereotype above
- If KD is below 1.0, destroy their aim
- If HS% is below 15, say they shoot at knees
- If ACS is below 150, say they're a spectator
- If on a losing streak, pile on hard
- If stats are good, roast their ego instead — call them a smurf or a no-lifer
- End with a brutal one-liner conclusion
- Max 5 sentences, all in one paragraph
`;

  } else if (data.platform === "github") {
    prompt = `
You are a senior developer roasting a junior's GitHub profile at a hackathon.
Write ONE sarcastic, funny paragraph. No bullet points, no emojis, no headers.

Their GitHub stats:
- Username: ${data.username}
- Followers: ${data.followers}
- Following: ${data.following}
- Public Repos: ${data.repos}
- Total Stars: ${data.stars}
- Bio: ${data.bio}
- Tone: ${data.tone || "Roast"}

Rules:
- If stars are 0, say even their mother hasn't starred their repos
- If repos are all tutorials, mock the copy-paste energy
- If bio is empty or generic, roast the lack of personality
- If following >> followers, call out the follow-for-follow energy
- Keep it sharp and specific to their numbers
`;

  } else if (data.platform === "chess") {
    prompt = `
You are a chess grandmaster roasting a patzer's chess.com profile.
Write ONE savage, funny paragraph. No bullet points, no emojis, no headers.

Their stats:
- Username: ${data.username}
- Rapid Rating: ${data.rapid_rating}
- Blitz Rating: ${data.blitz_rating}
- Bullet Rating: ${data.bullet_rating}
- Wins: ${data.wins}, Losses: ${data.losses}, Draws: ${data.draws}
- Tone: ${data.tone || "Roast"}

Rules:
- Reference exact ratings
- If under 800, say they learned from a pigeon
- If draws are high, say even the game pities them
- If losses >> wins, bury them
`;
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",  // upgrade: smarter model = funnier roasts
        messages: [
          {
            role: "system",
            content: "You are a savage, witty roast comedian. You write short, specific, funny roasts. Never generic. Always reference exact stats."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 1.0,   // max creativity
        max_tokens: 400     // enough for a full roast
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content.trim();

  } catch (err) {
    console.log("GROQ ERROR:", err.response?.data);
    throw err;
  }
}

module.exports = generateRoast;