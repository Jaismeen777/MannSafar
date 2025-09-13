import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors()); 
const GEMINI_API_KEY =  process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

app.post('/api/analyze-sentiment', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze the sentiment of the following text and categorize it as a single emotion from this list: Happy, Sad, Angry, Stressed, Depressed, Carefree, Emotional, or Neutral. Provide only the emotion word. Text: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const emotion = response.text().trim();

    res.status(200).json({ emotion });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to analyze emotion." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});