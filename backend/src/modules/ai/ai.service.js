import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeCropImage = async (filePath, mimeType) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Read file and convert to base64
    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString("base64");

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

    // The Prompt: Tailored for Bihar's Context
    const prompt = `
      You are an expert agricultural scientist for the state of Bihar, India.
      Analyze this image of a crop. 
      1. Identify the crop name.
      2. Identify the disease, pest, or nutrient deficiency. If it looks healthy, say so.
      3. List distinct symptoms you see.
      4. Recommend a cure using medicines/fertilizers commonly available in India/Bihar.
      5. Provide one organic/home remedy suitable for a village farmer.
      
      Format the output as JSON with these keys: 
      {
        "cropName": "String",
        "diagnosis": "String",
        "symptoms": ["String", "String"],
        "treatment": ["String", "String"],
        "organicCure": "String"
      }
      Do not use Markdown formatting, just return raw JSON.
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean up the text to ensure it's valid JSON
    const cleanText = text.replace(/```json|```/g, "").trim();
    
    return JSON.parse(cleanText);

  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to analyze image");
  } finally {
    // Clean up: Delete the uploaded file from temp storage
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};