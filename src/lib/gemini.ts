/* import { GoogleGenerativeAI } from '@google/generative-ai';
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length);

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Get the Gemini model instance
 * NOTE: @google/generative-ai ONLY supports `gemini-pro`
 */
export function getGeminiModel(modelName: string = 'gemini-2.0-flash') {
  return genAI.getGenerativeModel({ model: modelName });
}

/**
 * Generate text using Gemini
 */
export async function generateText(prompt: string) {
  try {
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    if (text == null) {
      throw new Error('Empty response from Gemini');
    }
    return text;
  } catch (error) {
    console.error('Error generating text with Gemini:', error);
    throw new Error('Failed to generate text');
  }
}

/**
 * Generate structured JSON response using Gemini
 */
export async function generateJSON<T>(prompt: string): Promise<T> {
  try {
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    if (text == null || text.trim() === '') {
      throw new Error('Empty response from Gemini');
    }

    // Extract JSON from markdown code blocks if present
    const jsonMatch =
      text.match(/```json\s*([\s\S]*?)```/) ||
      text.match(/```\s*([\s\S]*?)```/);

    const jsonString = jsonMatch ? jsonMatch[1] : text;
    const trimmed = jsonString?.trim() ?? '';
    if (!trimmed) {
      throw new Error('No JSON found in Gemini response');
    }

    return JSON.parse(trimmed) as T;
  } catch (error) {
    console.error('Error generating JSON with Gemini:', error);
    throw new Error('Failed to generate structured data');
  }
}

export default genAI;
 */