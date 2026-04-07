import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResponse, Transaction } from "../types";

const apiKey = process.env.GEMINI_API_KEY;

export async function analyzeFinancialData(rawData: string): Promise<AIAnalysisResponse> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following financial data (SMS, text, or CSV) and extract structured information.
    
    Data:
    ${rawData}
    
    Return a JSON response with:
    1. Extracted transactions (amount, date, merchant, category, payment_type).
    2. Smart insights (alerts, suggestions, predictions).
    3. Financial health score (0-100).
    4. Financial personality classification (Impulse Spender, Disciplined Saver, Risky Spender, Balanced User) with reasoning.
    5. Future predictions.
    
    Categories must be one of: Food, Travel, Shopping, Bills, Others.
    Payment types must be one of: UPI, Card, Cash, Bank.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          transactions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                amount: { type: Type.NUMBER },
                date: { type: Type.STRING, description: "YYYY-MM-DD" },
                merchant: { type: Type.STRING },
                category: { type: Type.STRING, enum: ["Food", "Travel", "Shopping", "Bills", "Others"] },
                payment_type: { type: Type.STRING, enum: ["UPI", "Card", "Cash", "Bank"] }
              },
              required: ["amount", "date", "merchant", "category", "payment_type"]
            }
          },
          insights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ["alert", "suggestion", "prediction"] },
                message: { type: Type.STRING }
              },
              required: ["type", "message"]
            }
          },
          score: { type: Type.NUMBER },
          personality: { type: Type.STRING },
          predictions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["transactions", "insights", "score", "personality", "predictions"]
      }
    }
  });

  return JSON.parse(response.text || "{}") as AIAnalysisResponse;
}

export async function extractBillData(base64Image: string, mimeType: string): Promise<Partial<Transaction>> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: `Extract financial data from this bill/receipt image. 
    Return a JSON object with:
    - amount (number)
    - date (YYYY-MM-DD)
    - merchant (string)
    - category (Food, Travel, Shopping, Bills, Others)
    - payment_type (UPI, Card, Cash, Bank)
    
    If a field is not found, omit it or use null.`,
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          amount: { type: Type.NUMBER },
          date: { type: Type.STRING },
          merchant: { type: Type.STRING },
          category: { type: Type.STRING, enum: ["Food", "Travel", "Shopping", "Bills", "Others"] },
          payment_type: { type: Type.STRING, enum: ["UPI", "Card", "Cash", "Bank"] }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
