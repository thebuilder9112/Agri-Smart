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
// Multimodal / text: gemini-3.1-flash-lite, gemini-3.7-flash, gemini-flash-latest
const MODEL_CANDIDATES = [
  "gemini-3.1-flash-lite",
  "gemini-3.7-flash",
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
      console.warn(`Model ${model} unavailable (${status}: ${msg.slice(0, 80)}). Switching to alternative candidate...`);
      // Brief 150ms pause before attempting next candidate
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }

  throw lastError || new Error("All Gemini models temporarily unavailable");
}
