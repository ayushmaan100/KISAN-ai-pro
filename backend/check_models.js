import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy init to get client
    // Note: The SDK doesn't always expose listModels directly on the client instance 
    // depending on version, so we use a direct fetch or try-catch the model generation.
    
    console.log("Checking specific models...");
    
    const modelsToTest = [
      "gemini-1.5-flash",
      "gemini-1.5-flash-001",
      "gemini-1.5-pro",
      "gemini-pro"
    ];

    for (const modelName of modelsToTest) {
      try {
        const m = genAI.getGenerativeModel({ model: modelName });
        const result = await m.generateContent("Hello");
        console.log(`✅ SUCCESS: Model '${modelName}' is working!`);
        break; // Stop at the first working one
      } catch (error) {
        console.log(`❌ FAILED: Model '${modelName}' - ${error.message.split('[')[0]}`);
      }
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
}

listModels();