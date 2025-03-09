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
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const faqs = JSON.parse(text);

    if (Array.isArray(faqs) && faqs.every(faq => faq.question && faq.answer)) {
      return faqs;
    }

    throw new Error("Invalid FAQ format returned");
  } catch (error) {
    console.error("Error generating FAQs:", error);
    return [];
  }
};
