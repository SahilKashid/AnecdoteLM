import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export interface FileInput {
  data: string; // Base64
  mimeType: string;
}

export const generateScenariosFromNotes = async (
  files: FileInput[]
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // We use gemini-3-pro-preview for better reasoning capabilities on complex text tasks
    const modelId = 'gemini-3-pro-preview';

    // Create a part for each file
    const fileParts = files.map(file => ({
      inlineData: {
        mimeType: file.mimeType,
        data: file.data.replace(/^data:(.*,)?/, '') // Clean base64 header if present
      }
    }));

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          ...fileParts,
          {
            text: "Generate a comprehensive set of application-based scenario questions and answers based on these documents. The data given is crucial and any crucial data loss in making scenarios is fatal. You must adhere strictly to the formatting rules in the system instruction (Headers, Blockquotes for context, Horizontal Rules)."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    if (!response.text) {
      throw new Error("No content generated.");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};