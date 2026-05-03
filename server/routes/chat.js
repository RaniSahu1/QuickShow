import express from "express";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "QuickShow",
  },
});

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system",content: `
You are QuickShow AI, a movie ticket booking assistant.

STRICT RULES:
- Only talk about movies, show timings, bookings, and FAQs.
- Never talk about presentations, slide decks, SaaS, or unrelated topics.
- Keep responses short (max 4-5 lines).
- Be friendly and modern.
- Use emojis sparingly (🎬 🍿 🎟️).
- Format responses cleanly with line breaks.
- Format responses with:
- A small emoji heading
- Bullet points using •
- Clean spacing
Your purpose:
Help users book tickets, suggest movies, explain seat hold policy (10 minutes), and answer booking questions.


`

     },
        { role: "user", content: message },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI error" });
  }
});

export default router;
