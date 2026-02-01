import OpenAI from "openai";


if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENROUTER API key is missing in .env.local");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // required by OpenRouter
    "X-Title": "JobPilot", // your app name
  },
});

/**
 * Generate plain text
 */
export async function generateText(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const text = response.choices[0]?.message?.content;

    if (!text || text.trim() === "") {
      throw new Error("Empty response from OpenRouter");
    }

    return text;
  } catch (error) {
    console.error("Error generating text:", error);
    throw new Error("Failed to generate text");
  }
}

/**
 * Generate strict JSON
 */
export async function generateJSON<T>(prompt: string): Promise<T> {
  try {
    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a strict JSON generator. Respond with ONLY valid JSON. No markdown, no commentary.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0,
    });

    const text = response.choices[0]?.message?.content;

    if (!text || text.trim() === "") {
      throw new Error("Empty JSON response");
    }

    return JSON.parse(text) as T;
  } catch (error) {
    console.error("Error generating JSON:", error);
    throw new Error("Failed to generate structured data");
  }
}

export default openai;
