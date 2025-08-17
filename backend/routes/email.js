import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { to, subject, html } = req.body;
        if (!to || !html) return res.status(400).json({ error: "Missing fields" });

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });

        const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to,
            subject: subject || "Meeting Summary",
            html
        });

        res.json({ ok: true, messageId: info.messageId });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;