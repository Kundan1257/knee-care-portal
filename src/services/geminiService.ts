import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 💡 SECURE: Read the key safely via Vite's metadata context layer!
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ 
  apiKey: apiKey ? apiKey.trim() : "" 
});

if (!apiKey) {
  console.warn("LOG: [Gemini] Environment variable VITE_GEMINI_API_KEY is missing or undefined.");
}


/**
 * Sends the user's chat input directly to Gemini AI and returns an educational response.
 * @param userPromptText The message typed or selected by the user.
 */
export const getKneeCareTip = async (userPromptText: string): Promise<string> => {
  if (!userPromptText.trim()) return "Please enter a valid question.";

  try {
    // Connect directly using the new canonical 2.5 flash generation method
    const response = await ai.models.generateContent({ 
      model: "gemini-2.5-flash",
      contents: userPromptText,
            config: {
        // Enforce health support boundaries directly inside the generation engine configurations
        systemInstruction: `You are a supportive, educational system assistant specializing in knee care, rehabilitation recovery tracking, and healthy lifestyle habits. 
        When answering user queries, you MUST strictly adhere to these compliance rules:
        1. Always provide at least 3 distinct variations, structural tracks, or self-care alternatives (e.g., specific alternative stretching modifications, low-impact paths, or home tracking metrics).
        2. Strictly avoid formulating explicit clinical, post-surgical, or specific tissue diagnoses or medical labels regarding the user's joint pain.
        3. Maintain a warm, encouraging, conversational tone suitable for an interactive assistant chatbot. Keep responses clear and easy to read on mobile viewports.`
      }

    });

    // Extract the completed response string from the return model content block
    return response.text || "No guidance text could be generated. Please try rephrasing your question.";
  } catch (error: any) {
    console.error("LOG: [Gemini SDK] Live content generation transaction crash:", error.message);
    return `I'm having trouble connecting to my AI core right now (${error.message}). Please try submitting your question again in a moment.`;
  }
};

export interface MealScanResults {
  detected_items: string[];
  score: number;
  quick_recipe: string;
  beverage_pairing: string;
}

const MEAL_SCAN_TIMEOUT_MS = 30_000;

export const analyzeMealImage = async (imageBase64: string): Promise<MealScanResults> => {
  if (!apiKey?.trim()) {
    throw new Error("Gemini is unavailable because VITE_GEMINI_API_KEY is not configured.");
  }
  if (!imageBase64.trim()) {
    throw new Error("The camera did not produce an image. Please try again.");
  }

  const model = new GoogleGenerativeAI(apiKey.trim()).getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
  });
  const request = model.generateContent([
    {
      text: `SYSTEM INSTRUCTIONS:
Act as a food-image evaluator and practical recipe writer. Identify only foods that are visible; do not infer ingredients that cannot be seen. Provide an anti-inflammatory index from 0 to 100 as a general food-pattern estimate, not a medical assessment. Do not diagnose or promise treatment, prevention, or tissue protection.
Always generate both recipe fields, even if no food is identifiable. Build the quick meal around the detected ingredients wherever practical, and include only simple, clearly named pantry additions when needed. Make it fast and actionable with numbered, concise preparation steps. Tailor the beverage as a joint-warming, comfort-focused thermal infusion using suitable detected ingredients where practical; include measured ingredients and concise preparation steps. Frame it as hydration that complements balanced eating patterns associated with maintaining normal tissue elasticity, without claiming to protect, repair, or treat joints or tissues.
Return only one raw, valid JSON object with exactly these four keys:
- "detected_items": an array of concise food names (empty if no food is identifiable)
- "score": a whole number from 0 to 100 representing the general anti-inflammatory food-pattern rating
- "quick_recipe": a fast meal recipe using the scanned ingredients, as concise numbered steps
- "beverage_pairing": a tailored warming thermal infusion recipe with ingredients and concise preparation steps
Do not wrap the JSON in markdown or code fences. Do not include any other text or keys.`,
    },
    { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
  ]);

  let timeoutId: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error("Gemini meal analysis timed out. Please try again.")),
      MEAL_SCAN_TIMEOUT_MS,
    );
  });

  try {
    const result = await Promise.race([request, timeout]);
    const parsed: unknown = JSON.parse(result.response.text());
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Gemini returned an invalid meal analysis. Please try again.");
    }

    const keys = Object.keys(parsed);
    if (
      keys.length !== 4 ||
      !keys.includes("detected_items") ||
      !keys.includes("score") ||
      !keys.includes("quick_recipe") ||
      !keys.includes("beverage_pairing")
    ) {
      throw new Error("Gemini returned an unexpected meal analysis format. Please try again.");
    }

    const scanResults = parsed as MealScanResults;
    if (
      !Array.isArray(scanResults.detected_items) ||
      !scanResults.detected_items.every((item) => typeof item === "string") ||
      typeof scanResults.score !== "number" ||
      !Number.isInteger(scanResults.score) ||
      scanResults.score < 0 ||
      scanResults.score > 100 ||
      typeof scanResults.quick_recipe !== "string" ||
      !scanResults.quick_recipe.trim() ||
      typeof scanResults.beverage_pairing !== "string" ||
      !scanResults.beverage_pairing.trim()
    ) {
      throw new Error("Gemini returned incomplete meal analysis. Please try again.");
    }

    return scanResults;
  } finally {
    clearTimeout(timeoutId);
  }
};
