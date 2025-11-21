import { GoogleGenAI, Chat } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const createFinancialChat = async (): Promise<Chat | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are APSO, a friendly and knowledgeable AI financial advisor for a mobile investment app.
        Your goal is to help users understand personal finance, compound interest, and the benefits of investing in our plans.
        
        App Details:
        - Currency: Indian Rupee (₹)
        - Focus: Daily return investment plans.
        - Tone: Professional yet approachable, encouraging, and concise.
        
        When asked about specific plans, explain the general concept of high-yield daily returns but advise them to check the "Plans" tab for live rates.
        Always warn about financial risks responsibly.`,
      },
    });
    return chat;
  } catch (error) {
    console.error("Failed to create chat", error);
    return null;
  }
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    return response.text || "I'm having trouble connecting to the financial network right now.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I can't respond at the moment.";
  }
};