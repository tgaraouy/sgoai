import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  try {
    const { messages, context } = await request.json();

    const completion = await openai.createChatCompletion({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant specialized in Moroccan travel and culture. 
          Current mode: ${context.mode}
          User status: ${context.travelStatus}
          Location: ${
            typeof context.location === "string"
              ? context.location
              : context.location.join(", ")
          }
          Interests: ${context.interests.join(", ")}
          
          Provide relevant, accurate, and helpful responses based on this context.`,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response =
      completion.data.choices[0].message?.content ||
      "I apologize, but I am unable to provide a response at this moment.";

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response" },
      { status: 500 }
    );
  }
}
