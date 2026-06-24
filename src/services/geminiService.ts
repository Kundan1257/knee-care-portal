import { GoogleGenAI } from "@google/genai";

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
        systemInstruction: `You are a supportive, educational system assistant for knee care, rehabilitation recovery tracking, and lifestyle habits. 
        When answering user queries, you MUST strictly adhere to these compliance rules:
        1. Always provide at least 3 distinct variations, structural tracks, or self-care alternatives (e.g., specific alternative stretching modifications, low-impact paths, or tracking paths).
        2. Strictly avoid formulating explicit clinical, post-surgical, or tissue diagnoses or labels regarding the user's joint pain.
        3. Every single text block outputted MUST conclude with an educational disclaimer paragraph confirming this is informational text and not a substitute for professional clinical medical advice.`
      }
    });

    // Extract the completed response string from the return model content block
    return response.text || "No guidance text could be generated. Please try rephrasing your question.";
  } catch (error: any) {
    console.error("LOG: [Gemini SDK] Live content generation transaction crash:", error.message);
    return `I'm having trouble connecting to my AI core right now (${error.message}). Please try submitting your question again in a moment.`;
  }
};
