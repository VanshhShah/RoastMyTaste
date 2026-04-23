const axios = require("axios");

async function generateRoast(data) {
  const prompt = `
You are RoastMyTaste, an AI that writes long, brutal, sarcastic critiques.

Write ONE continuous paragraph.
No bullet points.
No headings.
No emojis.
No positivity.

If platform is "chess":
Roast their skill, rating, and performance.

If platform is "github":
Roast their coding ability, number of repos, followers, and overall developer presence.
Be specific and make fun of patterns like low stars, no followers, empty bio, etc.
If github profile is weak (low repos, low stars), be extra brutal.
If strong, roast ego and overengineering.

User Data:
${JSON.stringify(data, null, 2)}

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