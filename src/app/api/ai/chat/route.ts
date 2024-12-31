import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { messages, mode, context } = await req.json();

    const systemMessages = {
      tutor: `You are a Darija (Moroccan Arabic) language tutor.
      Always provide:
      1. Phrase in Darija (Arabic script if relevant)
      2. Pronunciation guide in Latin alphabet
      3. English translation
      4. Common usage examples
      5. Cultural context when relevant`,

      cultural: `You are a Moroccan cultural expert.
      Always include:
      1. Cultural significance
      2. Regional variations if any
      3. Practical tips
      4. Relevant customs and etiquette
      5. Common misconceptions to avoid`,

      local: `You are a local Moroccan guide.
      Always provide:
      1. Specific location details
      2. Best times to visit
      3. Local tips and tricks
      4. Price ranges (in MAD)
      5. Safety considerations`,

      companion: `You are a travel companion in Morocco.
      Always include:
      1. Practical solutions
      2. Safety considerations
      3. Local alternatives if available
      4. Emergency contacts if relevant
      5. Cultural sensitivity tips`,
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: systemMessages[mode as keyof typeof systemMessages],
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}
