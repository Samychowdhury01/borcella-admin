import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateFAQs = async (payload: {
  title: string;
  description: string;
  category: string;
  tags: string[];
  sizes: string[];
  colors: string[];
  price: number;
}) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Generate 4 frequently asked questions (FAQs) in JSON format as an array of objects. Each object should contain a 'question' and 'answer'.

  Product Details:
  - Title: ${payload.title}
  - Description: ${payload.description}
  - Category: ${payload.category}
  - Tags: ${payload.tags.join(", ")}
  - Sizes: ${payload.sizes.join(", ")}
  - Colors: ${payload.colors.join(", ")}
  - Price: $${payload.price}

  Output example: [{"question": "", "answer": ""}, ...]
  Ensure the output is strictly in valid JSON format without any additional explanation or text.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    

    // Extract JSON content from potential text wrappers
    const jsonMatch = text.match(/\[([\s\S]*)\]/);
    if (!jsonMatch) throw new Error("No valid JSON found in the response");

    const faqs = JSON.parse(jsonMatch[0]);
    
    if (Array.isArray(faqs) && faqs.every(faq => faq.question && faq.answer)) {
      return faqs;
    }

    throw new Error("Invalid FAQ format returned");
  } catch (error) {
    console.error("Error generating FAQs:", error);
    return [];
  }
};
