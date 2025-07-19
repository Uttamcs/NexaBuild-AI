import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000", // Frontend server
    "http://localhost:5000"  // For direct API access
  ],
  methods: ["POST", "OPTIONS", "GET"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize GoogleGenAI with API key
const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

// API endpoint for generating websites
app.post("/api/generate", async (req, res) => {
  try {
    // Validate request
    if (!req.body?.prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const { prompt } = req.body;

    // Send generation request
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are an expert web developer. Create a complete, functional website based on the following description: 
"${prompt}"

Respond ONLY with a valid JSON object with these keys:
- html: complete HTML code
- css: complete CSS code
- js: complete JavaScript code

Requirements:
1. The website must be fully responsive
2. Use modern, clean design
3. Include all necessary functionality
4. No placeholders - use actual content
5. IMPORTANT: Return ONLY a raw JSON object with no markdown formatting, no code blocks, no backticks, and no explanations.
6. The response must be a valid JSON that can be parsed with JSON.parse().

Example of correct response format:
{
  "html": "<!DOCTYPE html><html>...</html>",
  "css": "body { ... }",
  "js": "document.addEventListener('DOMContentLoaded', function() { ... });"
}
              `,
            },
          ],
        },
      ],
    });

    // Extract and clean response
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Improved JSON extraction
    let jsonMatch = text.match(/\{[\s\S]*\}/); // Match everything between { and }
    let cleanedText = "";
    
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    } else {
      // Fallback to previous cleaning method
      cleanedText = text
        .replace(/```(?:json|js|javascript)?/gi, "")
        .replace(/```/g, "")
        .trim();
    }

    // Parse and validate response
    let code;
    try {
      code = JSON.parse(cleanedText);
      if (!code.html || !code.css || !code.js) {
        throw new Error("Missing required code fields");
      }
    } catch (err) {
      console.error("JSON parsing failed. Raw response:\n", text);
      return res.status(500).json({
        error: "Invalid response format from AI",
        details: err.message,
        rawResponse: text // Include raw response for debugging
      });
    }

    res.json(code);
  } catch (error) {
    console.error("Generation error:", error);
    res.status(500).json({
      error: "Failed to generate website",
      details: error.message,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: err.message
  });
});

app.listen(port, () => {
  console.log(`✅ Backend API server running on http://localhost:${port}`);
});