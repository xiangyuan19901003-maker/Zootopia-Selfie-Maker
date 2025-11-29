import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a Zootopia-themed image based on the user's photo and selected scenario.
 * Uses gemini-2.5-flash-image for image editing capabilities.
 */
export const generateZootopiaImage = async (
  base64Image: string,
  scenarioPrompt: string
): Promise<string> => {
  try {
    // Remove data URL prefix if present for the API call
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
    const mimeTypeMatch = base64Image.match(/^data:image\/(png|jpeg|jpg|webp);base64,/);
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
    const fullMimeType = `image/${mimeType}`;

    // Construct a strong prompt to guide the model to integrate the characters
    const fullPrompt = `
      Instruction: Edit this image to create a group selfie. 
      Subject: Keep the person in the uploaded photo as the central subject. Do not change their face.
      Additions: Add Judy Hopps and Nick Wilde from the movie Zootopia standing right next to the person, looking at the camera, posing for a selfie.
      Style: ${scenarioPrompt}
      Quality: High quality, cinematic lighting, 3D animated movie style blending seamlessly with the real person.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: fullMimeType,
            },
          },
          {
            text: fullPrompt,
          },
        ],
      },
    });

    // Extract the image from the response
    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }

    throw new Error("No image was generated. Please try again.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
