/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize the Google GenAI SDK with server-side API key
const aiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (aiApiKey && !aiApiKey.includes('MY_GEMINI_API_KEY')) {
  ai = new GoogleGenAI({
    apiKey: aiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn('GEMINI_API_KEY is not defined or is a placeholder. Gemini features will run in mock/simulation mode.');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json());

  // API Route: Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API Route: AI Tutor Chat
  app.post('/api/ai/tutor', async (req, res) => {
    const { message, history } = req.body;
    
    if (!message) {
      res.status(400).json({ error: 'Message parameter is required.' });
      return;
    }

    // Prepare system instructions for the tech AI tutor
    const systemInstruction = 
      "You are a friendly, supportive, and highly knowledgeable TECH AI tutor named 'SAC AI Tutor' at SAC Academy. " +
      "SAC represents a hybrid ecosystem: a digital advertising/marketing agency and a high-caliber technical learning hub (Edtech). " +
      "You help students, teachers, and clients with topics such as Full-Stack React development, UI/UX design, SEO, Growth Hacking, " +
      "Google Ads strategy, entrepreneurship, and digital assets. " +
      "Explain complex technical topics in simple, visual, and highly actionable terms. Use clean formatting, markdown, and " +
      "bullet points. If appropriate, write short code snippets. Always maintain an inspiring and helpful tone!";

    if (ai) {
      try {
        // Map history to the required parts schema for Gemini
        const contents = Array.isArray(history) ? history.map((msg: any) => ({
          role: msg.role === 'model' || msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        })) : [];

        // Push current prompt
        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.7
          }
        });

        res.json({ text: response.text || "I'm sorry, I couldn't process that response." });
      } catch (error: any) {
        console.error('Gemini API Error in Tutor:', error);
        res.status(500).json({ 
          error: 'Failed to generate response from AI Tutor.', 
          details: error.message 
        });
      }
    } else {
      // Return simulated educational answers if no key is supplied
      setTimeout(() => {
        let reply = "Hello! I am running in Offline Sandbox mode. Let me help you with your tech query! ";
        const queryLower = message.toLowerCase();
        
        if (queryLower.includes('react') || queryLower.includes('vite')) {
          reply += "\n\n**React Tips**:\n- React uses functional components and Hooks (`useState`, `useEffect`) to manage state.\n- Avoid infinite loops in `useEffect` by strictly specifying your dependency arrays.\n- Use custom hooks to isolate API requests and logic.";
        } else if (queryLower.includes('seo') || queryLower.includes('marketing') || queryLower.includes('ads')) {
          reply += "\n\n**SEO & Marketing Strategy**:\n- Use localized meta descriptions and key terms matching user queries.\n- Focus on page performance — slower sites lead to high bounce rates.\n- Run short target meta tests on landing pages before scaling budget.";
        } else if (queryLower.includes('firebase') || queryLower.includes('firestore')) {
          reply += "\n\n**Firestore Advice**:\n- Define secure access lists in `firestore.rules` preventing wild queries.\n- Separate private PII fields from public member attributes using split collections.\n- Always validate request parameters server-side or in security rule schemas.";
        } else {
          reply += `You asked about "${message}". As your SAC Mentor, I suggest starting with a small prototype, refining user pathways, testing layouts on mobile viewports, and building modular features step-by-step. Let me know if you need specific React code snippets or marketing hacks!`;
        }
        res.json({ text: reply });
      }, 800);
    }
  });

  // API Route: Parenting Tech & Learning Tips
  app.post('/api/ai/parenting', async (req, res) => {
    const { topic } = req.body;
    const systemInstruction = 
      "You are an expert educational psychologist and digital literacy counselor. " +
      "Generate short, practical advice for parents trying to encourage their children's technical skills, " +
      "inventive coding habits, responsible internet use, and digital product creation. Keep the output formatted as " +
      "three high-impact bullet points with bold headers.";

    const prompt = topic 
      ? `Provide 3 actionable tips for parents to help their children learn about: ${topic}`
      : "Provide 3 actionable parenting tips to help nurture technical curiosity and coding literacy in kids.";

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.6
          }
        });
        res.json({ advice: response.text || "Keep encourage tech curiosity daily." });
      } catch (error: any) {
        console.error('Gemini API Error in Parenting Advice:', error);
        res.status(500).json({ 
          error: 'Failed to fetch parenting tips from AI.', 
          details: error.message 
        });
      }
    } else {
      // Mock parenting advice response
      setTimeout(() => {
        res.json({
          advice: "**1. Co-Create Digital Products**:\nInstead of letting them only consume video streams, encourage them to customize small interactive game loops on Scratch or help you build a web list.\n\n" +
                  "**2. Gamify Real-Life Challenges**:\nTeach them basic algorithmic thinking (loops, branches, sequences) by sorting objects or planning schedules together.\n\n" +
                  "**3. Celebrate Technical Curiosity**:\nFrame errors as research data. If a program fails, reward their discovery of the bug rather than stressing the output!"
        });
      }, 500);
    }
  });

  // Vite integration as middleware (or static serving)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
