import express from "express";
import Groq from "groq-sdk";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/", async (req, res) => {
    try {
        const { transcript, prompt } = req.body;

        if (!transcript || !prompt) {
            return res.status(400).json({ error: "Missing transcript or prompt" });
        }

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a helpful AI meeting summarizer." },
                { role: "user", content: `${prompt}\n\nTranscript:\n${transcript}` },
            ],
        });

        // 🔎 Debug: log full raw response
        console.log("Groq raw response:", JSON.stringify(response, null, 2));

        // ✅ Try both formats (.message.content and .text)
        const summary =
            response.choices?.[0]?.message?.content?.trim() ||
            response.choices?.[0]?.text?.trim() ||
            "";

        res.json({ summary });
        // ...existing code...
    } catch (err) {
        console.error("Summarization error:", err);
        res.status(500).json({
            error: err.message || "Summarization failed",
            details: err // Add this line to see the full error object
        });
    }
    // ...existing code...
});

export default router;