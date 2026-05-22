import express from "express";

import cors from "cors";
import { openai } from "./configs/openai.js";
import multer from "multer";
import { createRequire } from "module";
import { chunkText } from "./chunkText.js";
import { vectorStore } from "./vectorStore.js";
const require = createRequire(import.meta.url);

const pdfParse = require("pdf-parse");

const app = express();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

//Allow multiple origins
const allowedOrigin = [
  "http://localhost:3001",
  "https://smarttalk-ai-weld.vercel.app",
];

app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello from SmartTalk AI",
  });
});

app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;
  const userMessage = prompt[prompt.length - 1].content;
  try {
    const results = await vectorStore.similaritySearch(userMessage, 4);
    const context = results.map((r) => r.pageContent).join("\n");
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: context,
        },
        ...prompt,
      ],
    });

    res.status(200).json({ message: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const data = await pdfParse(req.file.buffer);

    const chunks = chunkText(data.text, 1000);
    const docs = chunks.map((chunk, i) => ({
      pageContent: chunk,
      metadata: { chunkId: i },
    }));
    await vectorStore.addDocuments(docs);
    res.json({
      message: "PDF processed and stored in vector DB",
      chunks: docs.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log("server listening on 5000"));
