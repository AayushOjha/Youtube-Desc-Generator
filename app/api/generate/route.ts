import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

    const title = "top 10 rivers in India";
    const keywords = [
      "indian rivers",
      "top 10 comparison",
      "best rivers in india",
      "longest river in india",
      "biggest rivers in India in hindi",
    ];

    const prompt = `Write a compelling and SEO optimized YouTube description for a video titled "${title}". Here are some keywords to consider: ${keywords.join(
      ", "
    )}.

    **In the description, include:**
    * A brief overview of the video content.
    * Calls to action (e.g., subscribe, like, comment).
    * Links to relevant resources (if any).
  
    **Target audience:** (Optional: Add a description of your target audience here)
  
    **Note:** Keep the description concise and engaging (around 150-300 words).`;

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });
    return NextResponse.json(chatCompletion.choices);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
