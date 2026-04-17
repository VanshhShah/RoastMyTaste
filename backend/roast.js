const axios = require("axios");

async function generateRoast(data) {
  const prompt = `
You are RoastMyTaste, an AI that writes long, brutal, sarcastic critiques.

Write ONE continuous paragraph.
No bullet points.
No headings.
No emojis.
No positivity.

Tone: sarcastic, witty, brutal.

User Data:
Rating: ${data.rating}
Wins: ${data.wins}
Losses: ${data.losses}
Draws: ${data.draws}
Best rating: ${data.best}
Mode: ${data.mode}

Minimum length: 120 words.

Write the critique.
`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a brutally sarcastic roast generator."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 300
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (err) {
    console.log("GROQ ERROR:", err.response?.data); // 👈 THIS IS THE DEBUG
    throw err;
  }
}

module.exports = generateRoast;