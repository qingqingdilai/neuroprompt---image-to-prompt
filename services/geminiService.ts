import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePromptFromImage = async (
  base64Data: string,
  mimeType: string
): Promise<AnalysisResult> => {
  const client = getGeminiClient();

  const promptText = `
    Analyze this image in extreme detail to reverse-engineer a text-to-image generation prompt.
    
    Your goal is to provide a prompt that I could put into Midjourney, DALL-E 3, or Stable Diffusion to recreate this exact image.
    
    Pay attention to:
    1. Subject Matter (what is happening, who are the characters/objects).
    2. Art Style (e.g., 3D render, infographic, oil painting, photorealistic, cinematic).
    3. Composition, Lighting, and Color Palette.
    4. Text overlays or diagrams (describe their placement and content).
    5. Specific details (e.g., "brain evolution", "fish to human", glowing effects).

    Return the response in JSON format.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompt: {
              type: Type.STRING,
              description: "The highly detailed text-to-image prompt.",
            },
            elements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key visual elements identified in the image.",
            },
            style: {
              type: Type.STRING,
              description: "A concise description of the artistic style.",
            },
          },
          required: ["prompt", "elements", "style"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(resultText) as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};