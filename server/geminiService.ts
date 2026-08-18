import { GoogleGenAI, GenerateContentConfig } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Shared server-side Gemini client
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Resilient model cascade: tries primary model, if 503/429/overload occurs, automatically falls back to secondary models
const MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-3.7-flash",
  "gemini-2.5-pro",
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
      console.warn(`Model ${model} temporarily failed (${err?.status || err?.message}). Trying fallback model...`);
      // Short delay before next model attempt if needed
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  throw lastError || new Error("All Gemini models temporarily unavailable");
}
