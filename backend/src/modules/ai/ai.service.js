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

export const recommendCrops = async (farmDetails) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Get current month to make the recommendation time-accurate
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    const prompt = `
      You are an expert agricultural scientist specializing in Indian agriculture, specifically in Bihar.
      A farmer is asking what to plant right now.
      
      Here are the farm details:
      - Location: ${farmDetails.district}, ${farmDetails.state}
      - Soil Type: ${farmDetails.soilType}
      - Irrigation Available: ${farmDetails.irrigationType}
      - Current Month: ${currentMonth}

      Based strictly on these environmental factors and the current time of year, recommend the top 3 best crops to sow right now.
      
      Format the output EXACTLY as a JSON array of objects. Do not use Markdown formatting (like \`\`\`json). Just return the raw JSON array.
      [
        {
          "cropName": "Name of crop",
          "reason": "Why this is a good fit for this soil and month",
          "duration": "Estimated harvest time (e.g., 120 days)",
          "expectedYield": "Expected yield per acre (e.g., 15-20 Quintals)"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up to ensure valid JSON parsing
let cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();


   // Extract only the array part, ignoring any extra text Gemini might have added
    const startIndex = cleanText.indexOf('[');
    const endIndex = cleanText.lastIndexOf(']') + 1;
    
    if (startIndex !== -1 && endIndex !== -1) {
      cleanText = cleanText.substring(startIndex, endIndex);
    }

    return JSON.parse(cleanText);
    
  } catch (error) {
    console.error("Crop Recommendation Error:", error);
    throw new Error("Failed to generate recommendations");
  }
};