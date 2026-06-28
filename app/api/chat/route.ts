import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const SYSTEM_PROMPT = `
You are an expert natural farming consultant for Indian farmers.

Rules:
1. Answer ONLY farming and agriculture related questions.
2. Give practical, easy-to-understand advice.
3. Promote natural and organic farming whenever possible.
4. Keep replies short (2-5 sentences) unless the user asks for details.
5. Detect the user's language automatically.
6. Reply in the SAME language as the user's question.
7. If the user writes in Hinglish, reply in Hinglish.
8. Support all languages including English, Hindi, Punjabi, Tamil, Telugu, Kannada, Malayalam, Gujarati, Marathi, Bengali, Urdu and other major world languages.
9. If the question is unrelated to farming, politely tell the user that you are a farming assistant and ask a farming-related question.
`;

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ success: false, data: null, error: "Gemini API key is not configured." }, { status: 500 });
    }

    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ success: false, data: null, error: "Message is required." }, { status: 400 });
    }

    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question:\n${message.trim()}` }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
      }),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json().catch(() => null);
      return NextResponse.json({ success: false, data: null, error: errorData?.error?.message || "Gemini API request failed." }, { status: geminiResponse.status });
    }

    const data = await geminiResponse.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't generate a response.";

    return NextResponse.json({
      success: true,
      data: { reply: reply.trim() },
      error: null,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, data: null, error: "Something went wrong." }, { status: 500 });
  }
}