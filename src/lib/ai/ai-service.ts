import { AIContext, AIMessage } from "@/types/ai";

export async function getAIResponse(messages: AIMessage[], context: AIContext) {
  try {
    const response = await fetch("/api/ai/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, context }),
    });

    if (!response.ok) {
      throw new Error("AI request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
}
