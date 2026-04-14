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

const response = await axios.post(
"https://api.openai.com/v1/chat/completions",
{
model: "gpt-4.1",
messages: [
{ role: "user", content: prompt }
],
temperature: 0.9
},
{
headers: {
"Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
"Content-Type": "application/json"
}
}
);

return response.data.choices[0].message.content;
}

module.exports = generateRoast;