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
// Basic / multimodal vision: gemini-3.7-flash, gemini-flash-latest, gemini-3.1-flash-lite
// Complex reasoning / deep STEM: gemini-3.1-pro-preview
const MODEL_CANDIDATES = [
  "gemini-3.7-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
  "gemini-3.1-pro-preview",
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
      console.warn(`Model ${model} returned error (${err?.status || err?.message || err}). Trying next candidate...`);
      // Brief pause before trying next fallback model
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  throw lastError || new Error("All Gemini models temporarily unavailable");
}
