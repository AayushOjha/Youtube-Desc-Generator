import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export interface IFormData {
  title: string;
  keywords: string[];
  description?: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });
    const body: IFormData = await req.json();
    const { title, keywords, description } = body;

    let descriptionString = "";

    if (description) {
      descriptionString = `and brief description about video: "${description}"`;
    }

    const prompt = `Write a compelling and SEO optimized YouTube description for a video titled "${title}" ${descriptionString}. Here are some keywords to consider: ${keywords.join(
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
    return NextResponse.json(chatCompletion.choices[0].message.content);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
