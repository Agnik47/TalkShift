const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateChatSummary = async (messages) => {
  try {
    const conversation = messages
      .map((msg) => `${msg.sender?.username || "User"}: ${msg.content}`)
      .join("\n");

    const prompt = `
You are an AI assistant in a group chat.

Write a smooth, natural summary of the conversation in 2 sentences only.

Rules:
- Do NOT say "Here's a summary".
- Do NOT explain like "A asked B and B replied".
- Write like a final conclusion.
- Mention key topic and final plan/decision.
- Simple English.

Conversation:
${conversation}
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 120,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.log("AI Summary Error:", error.message);
    return "Sorry, AI summary is currently unavailable.";
  }
};

module.exports = { generateChatSummary };
