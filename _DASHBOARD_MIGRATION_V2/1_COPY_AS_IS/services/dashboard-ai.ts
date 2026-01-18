// Dashboard AI Service
// Extracted from main geminiService.ts for migration

import { GoogleGenAI } from "@google/genai";
import { ContentItem, DailyStat } from "../types/dashboard-types";

// Lazy initialize Gemini Client only when needed
// This prevents errors on page load if API key is not set
const getAI = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY is not configured. Please set your Google Generative AI API key.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzePerformance = async (
    recentContent: ContentItem[],
    stats: DailyStat[]
): Promise<string> => {
    try {
        const prompt = `
      You are a senior social media strategist. Analyze the following creator data and provide 3 specific, actionable bullet points to improve performance.
      
      Recent Content:
      ${JSON.stringify(recentContent.slice(0, 5))}
      
      Traffic Trends (Last 3 days):
      ${JSON.stringify(stats.slice(-3))}

      Keep the tone professional yet encouraging. Focus on what topics are working based on the grades.
    `;

        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-3-flash",
            contents: prompt
        });

        return response.text || "Unable to generate insights at this time.";
    } catch (error) {
        console.error("Error analyzing performance:", error);
        return "Could not complete analysis. Please check your API configuration.";
    }
};
