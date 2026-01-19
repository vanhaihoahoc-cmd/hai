import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  // Sử dụng trực tiếp API_KEY từ process.env theo quy định
  const apiKey = process.env.API_KEY || '';
  return new GoogleGenAI({ apiKey });
};

export const explainQuestion = async (questionText: string, options: string[], correctAnswer: string, userAnswer: string) => {
  const ai = getAI();
  const prompt = `
    Bạn là một trợ lý giáo dục AI của VANHAI EDUCATION. 
    Hãy giải thích chi tiết câu hỏi sau đây cho học sinh THPT:
    Câu hỏi: ${questionText}
    Các lựa chọn: ${options.join(', ')}
    Đáp án đúng: ${correctAnswer}
    Học sinh chọn: ${userAnswer}

    Hãy giải thích tại sao đáp án đó đúng và cung cấp phương pháp giải nhanh cho dạng bài này.
    Trả lời bằng tiếng Việt, trình bày rõ ràng, dễ hiểu.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Xin lỗi, hiện tại tôi không thể đưa ra giải thích. Vui lòng thử lại sau.";
  }
};

export const generateBrandLogo = async () => {
  const ai = getAI();
  const prompt = `
    Recreating a high-end education logo: 
    "High-end education logo design named VANHAI EDUCATION.
    The main symbol is a modern, minimalist, stylized graduation cap.
    The cap's tassel transforms into a ray of knowledge or a delicate little flame.
    Elegant, modern, and inspiring style.
    Main colors: deep turquoise (teal) background, logo and lettering in luxury metallic gold, with a subtle metallic reflection effect.
    The words VANHAI EDUCATION are in uppercase, using a modern, solid sans-serif font.
    The layout is balanced, easily recognizable, and suitable for video intros, slides, banners, and avatars.
    High-resolution, 4K quality, cinematic lighting effects."
    Ensure the gold has a realistic 3D texture and the teal background feels premium.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};