"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/db/supabase";
import { offlineManager } from "@/lib/storage/offlineManager";
import { DarijaPhrase } from "@/types/darija";
import {
  ArrowLeft,
  Bookmark,
  Building2,
  Car,
  ChevronRight,
  Coffee, // instead of Hotel
  Loader2,
  Map,
  MessageCircle,
  Send,
  ShoppingCart,
  Star, // instead of Taxi
  UtensilsCrossed, // instead of Utensils
  Volume2,
} from "lucide-react";
import React, { useCallback } from "react";

interface AIMode {
  id: string;
  name: string;
  icon: string;
  description: string;
  promptContext: string;
  suggestedQuestions: string[];
  scenarios?: {
    id: string;
    name: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
  }[];
}

const aiModes: AIMode[] = [
  {
    id: "tutor",
    name: "Darija Tutor",
    icon: "📚",
    description: "Conversational Darija learning Phrases Make it Easy",
    promptContext: `You are a Darija (Moroccan Arabic) language tutor. 
    Always provide phrases with: 
    1) Darija text in Arabic script
    2) Pronunciation in Latin letters
    3) English translation
    4) Usage examples
    5) Cultural context when relevant`,
    suggestedQuestions: [
      "How do I say 'hello'?",
      "Basic shopping phrases",
      "Numbers 1-10 in Darija",
    ],
    scenarios: [
      {
        id: "cafe",
        name: "Café & Drinks",
        icon: Coffee,
        color: "text-brown-500",
      },
      {
        id: "shopping",
        name: "Shopping & Haggling",
        icon: ShoppingCart,
        color: "text-green-500",
      },
      {
        id: "transport",
        name: "Taxis & Transport",
        icon: Car,
        color: "text-yellow-500",
      },
      {
        id: "restaurant",
        name: "Restaurants",
        icon: UtensilsCrossed,
        color: "text-red-500",
      },
      {
        id: "directions",
        name: "Asking Directions",
        icon: Map,
        color: "text-blue-500",
      },
      {
        id: "hotel",
        name: "Hotel & Accommodation",
        icon: Building2,
        color: "text-purple-500",
      },
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
interface AIAssistantProps {
  initialMode?: string;
}

export function AIAssistant({ initialMode }: AIAssistantProps) {
  const [selectedMode, setSelectedMode] = React.useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = React.useState<string | null>(
    null
  );
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputMessage, setInputMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [phrases, setPhrases] = React.useState<DarijaPhrase[]>([]);
  const [currentPhraseIndex, setCurrentPhraseIndex] = React.useState(0);
  const [savedPhrases, setSavedPhrases] = React.useState<DarijaPhrase[]>([]);
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);
  const [showSaved, setShowSaved] = React.useState(false);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    setSavedPhrases(offlineManager.getSavedPhrases());
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (selectedScenario) {
      loadPhrases(selectedScenario);
    }
  }, [selectedScenario, loadPhrases]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadPhrases = useCallback(
    async (scenario: string) => {
      try {
        if (isOffline) {
          const cachedPhrases = offlineManager.getCachedPhrases();
          setPhrases(
            cachedPhrases.filter((p) => p.category.english === scenario)
          );
          return;
        }

        const { data, error } = await supabase
          .from("darija_phrases")
          .select("*")
          .eq("category->english", scenario)
          .order("likes", { ascending: false });

        if (error) throw error;
        if (data) {
          setPhrases(data as DarijaPhrase[]);
          setCurrentPhraseIndex(0);
          offlineManager.cacheEssentialPhrases(data as DarijaPhrase[]);
        }
      } catch (error) {
        console.error("Error loading phrases:", error);
        toast({
          title: "Error",
          description: "Failed to load phrases for this scenario",
          variant: "destructive",
        });
      }
    },
    [isOffline, setPhrases, setCurrentPhraseIndex, toast]
  );

  const handleSendMessage = async (messageText: string = inputMessage) => {
    if (!messageText.trim() || !selectedMode || isLoading) return;

    setIsLoading(true);
    const selectedModeData = aiModes.find((m) => m.id === selectedMode);
    let contextualPrompt = selectedModeData?.promptContext || "";

    // Add current phrase context if in tutor mode and viewing a phrase
    if (selectedMode === "tutor" && phrases[currentPhraseIndex]) {
      const currentPhrase = phrases[currentPhraseIndex];
      contextualPrompt += `\nCurrent phrase being discussed:
        Darija: ${currentPhrase.darija}
        Pronunciation: ${currentPhrase.phonetic_transcription}
        English: ${currentPhrase.translations.english}
        Usage: ${currentPhrase.usage_contexts.situational_examples.join(", ")}`;
    }

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
          context: contextualPrompt,
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

  const handleSavePhrase = (phrase: DarijaPhrase) => {
    const saved = offlineManager.savePhrase(phrase);
    if (saved) {
      setSavedPhrases(offlineManager.getSavedPhrases());
      toast({
        title: "Phrase Saved",
        description: "This phrase is now available offline",
      });
    }
  };

  const resetChat = () => {
    setSelectedMode(null);
    setSelectedScenario(null);
    setMessages([]);
    setInputMessage("");
    setPhrases([]);
    setCurrentPhraseIndex(0);
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

  // Inside the AIAssistant component, for the scenario selection view:
  if (selectedMode === "tutor" && !selectedScenario) {
    const tutorMode = aiModes.find((m) => m.id === "tutor")!;

    return (
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-4 p-4">
          <Button
            variant="ghost"
            onClick={resetChat}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h2 className="text-xl">Choose a Scenario</h2>
        </div>

        {/* Main Content with Grid Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "1.5rem",
            width: "100%",
            padding: "2rem",
          }}
        >
          <button
            onClick={() => setSelectedScenario("cafe")}
            className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Coffee className="w-8 h-8 mb-2" />
            <span>Café & Drinks</span>
          </button>

          <button
            onClick={() => setSelectedScenario("shopping")}
            className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ShoppingCart className="w-8 h-8 mb-2" />
            <span>Shopping & Haggling</span>
          </button>

          <button
            onClick={() => setSelectedScenario("transport")}
            className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Car className="w-8 h-8 mb-2" />
            <span>Taxis & Transport</span>
          </button>

          <button
            onClick={() => setSelectedScenario("restaurants")}
            className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <UtensilsCrossed className="w-8 h-8 mb-2" />
            <span>Restaurants</span>
          </button>

          <button
            onClick={() => setSelectedScenario("directions")}
            className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Map className="w-8 h-8 mb-2" />
            <span>Asking Directions</span>
          </button>

          <button
            onClick={() => setSelectedScenario("hotel")}
            className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Building2 className="w-8 h-8 mb-2" />
            <span>Hotel & Accommodation</span>
          </button>
        </div>

        {/* Saved Phrases Section */}
        <div className="mt-auto p-4 border-t">
          <button
            onClick={() => setShowSaved(!showSaved)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Bookmark className="w-5 h-5" />
            <span>Saved Phrases ({savedPhrases.length})</span>
          </button>
        </div>
        {showSaved && savedPhrases.length > 0 && (
          <Card className="mt-4 p-4">
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {savedPhrases.map((phrase) => (
                  <Card key={phrase.id} className="p-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-arabic">{phrase.darija}</p>
                        <p className="text-sm text-gray-600">
                          {phrase.translations.english}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          offlineManager.removePhrase(phrase.id);
                          setSavedPhrases(offlineManager.getSavedPhrases());
                        }}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        )}
      </div>
    );
  }

  const currentMode = aiModes.find((m) => m.id === selectedMode)!;
  const currentPhrase = phrases[currentPhraseIndex];

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col h-[600px] rounded-lg border bg-white">
        <div className="p-4 border-b flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() =>
              selectedScenario ? setSelectedScenario(null) : resetChat()
            }
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h2 className="font-semibold text-lg">
            {selectedScenario
              ? currentMode.scenarios?.find((s) => s.id === selectedScenario)
                  ?.name
              : currentMode.name}
          </h2>
          <div className="w-[70px]" />
        </div>

        <ScrollArea className="flex-1 p-4">
          {/* Show current phrase if in tutor mode and scenario selected */}
          {selectedMode === "tutor" && selectedScenario && currentPhrase && (
            <Card className="mb-4 p-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="flex justify-center items-center gap-3 mb-4">
                    <p className="text-3xl font-arabic">
                      {currentPhrase.darija}
                    </p>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <Volume2 className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>
                  <p className="text-lg text-gray-600 mb-2">
                    {currentPhrase.phonetic_transcription}
                  </p>
                  <p className="text-xl mb-1">
                    {currentPhrase.translations.english}
                  </p>
                  <p className="text-gray-600">
                    {currentPhrase.translations.french}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">When to use:</h3>
                  <ul className="space-y-2">
                    {currentPhrase.usage_contexts.situational_examples.map(
                      (example, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ChevronRight className="w-5 h-5 text-gray-400 mt-0.5" />
                          <span>{example}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => handleSavePhrase(currentPhrase)}
                    disabled={offlineManager.isPhraseInSaved(currentPhrase.id)}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    {offlineManager.isPhraseInSaved(currentPhrase.id)
                      ? "Saved"
                      : "Save"}
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentPhraseIndex((prev) =>
                        prev < phrases.length - 1 ? prev + 1 : 0
                      );
                    }}
                  >
                    Next Phrase
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Chat Messages */}
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

          {/* Show suggestions if no messages */}
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

        {/* Chat Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask about ${
                currentPhrase ? "this phrase" : "anything"
              }...`}
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

        {/* Offline Mode Indicator */}
        {isOffline && (
          <div className="p-2 bg-yellow-100 text-yellow-800 text-center text-sm">
            Offline Mode - Using Saved Phrases Only
          </div>
        )}
      </div>
    </div>
  );
}
