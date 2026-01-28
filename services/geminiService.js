
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateComparison = async (prompt, selectedStores) => {
  const model = 'gemini-3-flash-preview';

  const response = await ai.models.generateContent({
    model,
    contents: `The user wants to compare prices for: "${prompt}". 
    The available stores are: ${selectedStores.join(', ')}.
    Return a detailed price comparison in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING, description: "A friendly intro message." },
          comparisonData: {
            type: Type.OBJECT,
            properties: {
              productName: { type: Type.STRING },
              productImage: { type: Type.STRING, description: "Use a placeholder URL from picsum or similar for the product." },
              stores: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    storeName: { type: Type.STRING },
                    storeIcon: { type: Type.STRING, description: "A Material Symbol name like storefront or local_grocery_store" },
                    price: { type: Type.NUMBER },
                    currency: { type: Type.STRING }
                  },
                  required: ["storeName", "price"]
                }
              },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["productName", "stores", "recommendations"]
          }
        },
        required: ["text"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    return { text: "I'm sorry, I couldn't generate a comparison right now." };
  }
};
