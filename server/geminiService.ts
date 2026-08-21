import { GoogleGenAI, GenerateContentConfig } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Shared server-side Gemini client using modern @google/genai SDK
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Modern valid model list as per guidelines
// Basic / multimodal vision: gemini-3.7-flash, gemini-3.1-flash-lite, gemini-flash-latest
const MODEL_CANDIDATES = [
  "gemini-3.7-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
];

export async function generateContentWithRetry(params: {
  contents: any;
  config?: GenerateContentConfig;
  preferredModel?: string;
}) {
  const modelsToTry = params.preferredModel
    ? [params.preferredModel, ...MODEL_CANDIDATES.filter((m) => m !== params.preferredModel)]
    : MODEL_CANDIDATES;

  let lastError: any = null;

  for (const model of modelsToTry) {
    // Attempt up to 2 tries per model with backoff
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        if (response && (response.text || response.candidates?.length)) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const status = err?.status || err?.code || "";
        const msg = err?.message || String(err);
        console.warn(`Model ${model} attempt ${attempt} returned error (${status}: ${msg.substring(0, 100)}).`);
        
        // If 429 or 503, wait briefly before retrying or switching
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
        }
      }
    }
    // Pause briefly before switching to next candidate model
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  throw lastError || new Error("All Gemini models temporarily unavailable");
}
