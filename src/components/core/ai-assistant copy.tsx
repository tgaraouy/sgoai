"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, MessageCircle, Send } from "lucide-react";
import React from "react";

interface AIMode {
  id: string;
  name: string;
  icon: string;
  description: string;
  promptContext: string;
  suggestedQuestions: string[];
}

const aiModes: AIMode[] = [
  {
    id: "tutor",
    name: "Darija Tutor",
    icon: "📚",
    description: "Conversational Darija learning Phrases Make it Easy",
    promptContext:
      "You are a Darija (Moroccan Arabic) language tutor. Always provide phrases with: 1) Darija text 2) Pronunciation 3) English translation 4) Usage examples",
    suggestedQuestions: [
      "How do I say 'hello'?",
      "Basic shopping phrases",
      "Numbers 1-10 in Darija",
    ],
  },
  {
    id: "cultural",
    name: "Cultural Guide",
    icon: "🌍",
    description: "Deep cultural insights and situational guidance",
    promptContext:
      "You are a Moroccan cultural expert. Provide detailed cultural context and practical tips for respectful interaction.",
    suggestedQuestions: [
      "Appropriate dress code",
      "Greeting customs",
      "Dining etiquette",
    ],
  },
  {
    id: "local",
    name: "Local Expert",
    icon: "📍",
    description: "Real-time local recommendations and insights",
    promptContext:
      "You are a local Moroccan expert. Provide specific local recommendations with timing, pricing, and insider tips.",
    suggestedQuestions: [
      "Best time to visit markets",
      "Local food specialties",
      "Hidden gems nearby",
    ],
  },
  {
    id: "companion",
    name: "Travel Companion",
    icon: "🧠",
    description: "Smart travel assistance and situation handling",
    promptContext:
      "You are a travel companion in Morocco. Help with practical situations and provide safety-focused advice.",
    suggestedQuestions: [
      "Getting around safely",
      "Emergency contacts",
      "Common scams to avoid",
    ],
  },
];

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export function AIAssistant() {
  const [selectedMode, setSelectedMode] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputMessage, setInputMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText: string = inputMessage) => {
    if (!messageText.trim() || !selectedMode || isLoading) return;

    setIsLoading(true);
    const selectedModeData = aiModes.find((m) => m.id === selectedMode);

    const newMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, newMessage],
          mode: selectedMode,
          context: selectedModeData?.promptContext,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setSelectedMode(null);
    setMessages([]);
    setInputMessage("");
  };

  if (!selectedMode) {
    return (
      <div className="container mx-auto p-4">
        <h3 className="text-2xl font-medium mt-8 mb-6 text-center text-[#006E90]">
          Choose Your AI Agent:
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "1.5rem",
            width: "100%",
          }}
        >
          {aiModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "1.5rem",
                borderWidth: "2px",
                borderStyle: "solid",
                borderColor: "#e5e7eb",
                borderRadius: "1rem",
                transition: "all 300ms",
                backgroundColor: "white",
                minWidth: "250px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              className="hover:border-[#006E90] hover:bg-[#006E90]/5 group"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-4 rounded-full bg-[#006E90]/10 group-hover:bg-[#006E90]/20 transition-colors">
                  <span className="text-4xl">{mode.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-3 text-[#006E90] group-hover:text-[#006E90]">
                    {mode.name}
                  </h3>
                  <p className="text-sm text-gray-600 max-w-[200px] mx-auto leading-relaxed">
                    {mode.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }
  const currentMode = aiModes.find((m) => m.id === selectedMode)!;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col h-[600px] rounded-lg border bg-white">
        <div className="p-4 border-b flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={resetChat}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h2 className="font-semibold text-lg">{currentMode.name}</h2>
          <div className="w-[70px]" /> {/* Spacer for centering */}
        </div>

        <ScrollArea className="flex-1 p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="space-y-4">
              <p className="text-center text-gray-500">
                Get started with some suggested questions:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {currentMode.suggestedQuestions.map((question) => (
                  <Button
                    key={question}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMessage(question)}
                    className="text-left"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask your ${currentMode.name.toLowerCase()}...`}
              className="min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="px-4"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
