import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import summarizeRoute from "./routes/summarize.js";
import emailRoute from "./routes/email.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/summarize", summarizeRoute);
app.use("/api/email", emailRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
