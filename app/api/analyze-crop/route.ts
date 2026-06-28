// app/api/analyze-crop/route.ts
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are an expert agricultural plant pathologist AI. When given an image of a crop/plant, analyze it carefully and return a diagnosis in strict JSON format.

ALWAYS respond with ONLY valid JSON, no markdown, no explanation outside the JSON. Use this exact structure:

{
  "diseaseName": "string (e.g. 'Early Blight', 'Powdery Mildew', 'Healthy Plant')",
  "crop": "string (e.g. 'Tomato', 'Wheat', 'Rice', 'Unknown')",
  "confidence": number (0-100),
  "severity": "healthy" | "moderate" | "severe",
  "remedy": ["step 1", "step 2", "step 3"],
  "prevention": ["tip 1", "tip 2", "tip 3"],
  "description": "string - brief 1-2 sentence description of what was found"
}

If the image is NOT a plant/crop, set diseaseName to "Not a plant image", severity to "healthy", confidence to 0, and explain in description.`;

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64 || !mimeType) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: SYSTEM_PROMPT },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: imageBase64,
                },
              },
              {
                text: "Analyze this crop/plant image and provide a detailed disease diagnosis. Return ONLY the JSON response.",
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1024,
        },
      }),
    });

    const data = await response.json();

    console.log("Gemini response status:", response.status);
    console.log("Gemini response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return NextResponse.json(
        { error: `Gemini error: ${data?.error?.message || response.statusText}` },
        { status: 500 }
      );
    }

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!rawText) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 500 }
      );
    }

    const cleanJson = rawText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const diagnosis = JSON.parse(cleanJson);

    return NextResponse.json(diagnosis);
  } catch (error) {
    console.error("Crop analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image. Please try again." },
      { status: 500 }
    );
  }
}