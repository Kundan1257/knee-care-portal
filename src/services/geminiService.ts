import { GoogleGenAI } from "@google/genai";

<<<<<<< HEAD
// 1. Initialize the live Google SDK with your secure local token mapping
const genAI = new GoogleGenerativeAI("AQ.Ab8RN6K4OiYsFuns9Sj4X_nzzA55np3nqc_tc6Ynun1Zjssmhg");

export const getKneeCareTip = async (userPromptText: string) => {

  try {
    // 2. Target the ultra-fast, high-utility gemini-1.5-flash model
        // @ts-ignore - Bypass strict property type constraints for system instructions
    const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash-lite",
 // systemInstruction: "You are an elite clinical knee recovery assistant. Provide precise, empathetic, post-surgical mobilization insights and safety guardrails. Keep text under 4 bullet points."
});
  


    // 3. Execute the live dynamic prompt generation stream
    const result = await model.generateContent(userPromptText);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Gemini Live Bridge Failed:", error);
    return "Our automated health grid is optimizing tracking parameters. Please try re-submitting your query.";
  }
=======
const getAI = () => {
  const apiKey = typeof process !== 'undefined' ? process.env.VITE_GEMINI_API_KEY : null;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
>>>>>>> 8f60833 (Secure Gemini integration with env variables and remove hardcoded secrets)
};

export async function generateKneeContent(systemPrompt: string, userPrompt: string) {
  try {
    const ai = getAI();
    if (!ai) return "I'm here to help with your knee care.";
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${systemPrompt}\n\nUser Query: ${userPrompt}`,
    });
    return response.text || "I'm here to help with your knee care.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting right now.";
  }
}

export async function getKneeCareTip(prompt: string) {
  try {
    const ai = getAI();
    if (!ai) return "I'm here to help with your knee care. Try some gentle stretching!";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a helpful knee-care assistant. Provide a short, practical, and supportive tip for knee health based on the following query: "${prompt}". Keep it simple and avoid medical claims.`,
    });
    return response.text || "I'm here to help with your knee care. Try some gentle stretching!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting right now, but remember to stay active and gentle with your knees!";
  }
}
