"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Brain,
  CalendarDays,
  Car,
  Clock,
  Coffee,
  Globe2,
  Loader2,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Send,
  ShoppingBag,
  Star,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AIMode {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  features: string[];
}

interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface AIContext {
  mode: string;
  travelStatus: "current" | "planning" | null;
  location: string | string[];
  interests: string[];
}

const aiModes: AIMode[] = [
  {
    id: "tutor",
    name: "Language Tutor",
    icon: BookOpen,
    color: "blue",
    description: "Personalized language learning with adaptive exercises",
    features: [
      "Custom learning paths",
      "Pronunciation feedback",
      "Progress tracking",
      "Contextual practice",
    ],
  },
  {
    id: "cultural",
    name: "Cultural Guide",
    icon: Globe2,
    color: "purple",
    description: "Deep cultural insights and situational guidance",
    features: [
      "Cultural context",
      "Local customs",
      "Social etiquette",
      "Regional variations",
    ],
  },
  {
    id: "local",
    name: "Local Expert",
    icon: Navigation,
    color: "green",
    description: "Real-time local recommendations and insights",
    features: [
      "Live events",
      "Hidden gems",
      "Local tips",
      "Weather-aware suggestions",
    ],
  },
  {
    id: "companion",
    name: "Travel Companion",
    icon: Brain,
    color: "orange",
    description: "Smart travel assistance and situation handling",
    features: [
      "Navigation help",
      "Emergency assistance",
      "Real-time translation",
      "Local emergency contacts",
    ],
  },
];

const MOROCCAN_CITIES = [
  "Marrakech",
  "Fes",
  "Casablanca",
  "Tangier",
  "Rabat",
  "Other",
];

const INTERESTS = [
  { label: "Basic Conversations", icon: MessageCircle },
  { label: "Shopping & Bargaining", icon: ShoppingBag },
  { label: "Food & Dining", icon: Coffee },
  { label: "Transportation", icon: Car },
  { label: "Cultural Activities", icon: Globe2 },
  { label: "Emergency Situations", icon: Phone },
];

async function getAIResponse(messages: AIMessage[], context: AIContext) {
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

export function AIAssistant() {
  // Core state
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [travelStatus, setTravelStatus] = useState<
    "current" | "planning" | null
  >(null);
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [plannedCities, setPlannedCities] = useState<string[]>([]);

  // Chat state
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleCityToggle = (city: string) => {
    setPlannedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const handleStartExperience = async () => {
    if (!selectedMode || !travelStatus) return;

    const context: AIContext = {
      mode: selectedMode,
      travelStatus,
      location: travelStatus === "current" ? currentCity! : plannedCities,
      interests: selectedInterests,
    };

    setIsLoading(true);
    try {
      const systemMessage: AIMessage = {
        role: "system",
        content: `You are the ${selectedMode} AI assistant for a user who is ${
          travelStatus === "current" ? "currently in" : "planning to visit"
        } Morocco. Their interests include: ${selectedInterests.join(", ")}.`,
      };

      const initialMessage: AIMessage = {
        role: "assistant",
        content: `Hi! I'm your ${
          aiModes.find((m) => m.id === selectedMode)?.name
        } assistant. How can I help you with your ${
          travelStatus === "current" ? "stay" : "trip planning"
        } in Morocco?`,
      };

      setMessages([systemMessage, initialMessage]);
      setHasStarted(true);
    } catch (error) {
      console.error("Error starting experience:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const newUserMessage: AIMessage = {
      role: "user",
      content: inputMessage,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const context: AIContext = {
        mode: selectedMode!,
        travelStatus,
        location: travelStatus === "current" ? currentCity! : plannedCities,
        interests: selectedInterests,
      };

      const response = await getAIResponse(
        [...messages, newUserMessage],
        context
      );

      const assistantMessage: AIMessage = {
        role: "assistant",
        content: response.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: AIMessage = {
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderModeCard = (mode: AIMode) => (
    <Card
      key={mode.id}
      className={`cursor-pointer transition-all hover:ring-2 hover:ring-${
        mode.color
      }-500 ${
        selectedMode === mode.id
          ? `ring-2 ring-${mode.color}-500 bg-${mode.color}-50`
          : ""
      }`}
      onClick={() => setSelectedMode(mode.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-${mode.color}-100`}>
            <mode.icon className={`h-6 w-6 text-${mode.color}-600`} />
          </div>
          <div>
            <h4 className="font-semibold">{mode.name}</h4>
            <p className="text-sm text-gray-600">{mode.description}</p>
          </div>
        </div>
        {selectedMode === mode.id && (
          <div className="mt-3 space-y-2">
            <p className="text-sm font-medium">Features:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              {mode.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Star className="h-3 w-3" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderInterests = () => (
    <div>
      <h3 className="font-medium mb-2">What interests you most?</h3>
      <div className="grid grid-cols-2 gap-2">
        {INTERESTS.map((interest) => (
          <Button
            key={interest.label}
            variant="outline"
            className={`justify-start ${
              selectedInterests.includes(interest.label)
                ? "ring-2 ring-blue-500 bg-blue-50"
                : ""
            }`}
            onClick={() => handleInterestToggle(interest.label)}
          >
            <interest.icon className="h-4 w-4 mr-2" />
            {interest.label}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderTravelStatus = () => (
    <div className="space-y-4">
      <h3 className="font-medium mb-2">Your Travel Status</h3>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className={`flex flex-col items-center p-4 h-auto ${
            travelStatus === "current" ? "ring-2 ring-blue-500 bg-blue-50" : ""
          }`}
          onClick={() => setTravelStatus("current")}
        >
          <MapPin className="h-6 w-6 mb-2" />
          <span className="text-sm">I'm in Morocco</span>
          <span className="text-xs text-gray-600 mt-1">
            Need immediate help
          </span>
        </Button>
        <Button
          variant="outline"
          className={`flex flex-col items-center p-4 h-auto ${
            travelStatus === "planning" ? "ring-2 ring-blue-500 bg-blue-50" : ""
          }`}
          onClick={() => setTravelStatus("planning")}
        >
          <CalendarDays className="h-6 w-6 mb-2" />
          <span className="text-sm">Planning a Trip</span>
          <span className="text-xs text-gray-600 mt-1">
            Preparing for visit
          </span>
        </Button>
      </div>

      {travelStatus === "current" && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Where in Morocco are you?</p>
          <div className="grid grid-cols-2 gap-2">
            {MOROCCAN_CITIES.map((city) => (
              <Button
                key={city}
                variant="outline"
                className={`justify-start ${
                  currentCity === city ? "ring-2 ring-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => setCurrentCity(city)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {city}
              </Button>
            ))}
          </div>
        </div>
      )}

      {travelStatus === "planning" && (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">When are you traveling?</p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Select Dates
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Duration
              </Button>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">
              Which cities will you visit?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MOROCCAN_CITIES.map((city) => (
                <Button
                  key={city}
                  variant="outline"
                  className={`justify-start ${
                    plannedCities.includes(city)
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => handleCityToggle(city)}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {city}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderChat = () => (
    <div className="space-y-4">
      <ScrollArea className="h-[400px] pr-4">
        {messages
          .filter((m) => m.role !== "system")
          .map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="flex gap-2">
        <Textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );

  const canProceed =
    selectedMode &&
    travelStatus &&
    (travelStatus === "current" ? currentCity : plannedCities.length > 0) &&
    selectedInterests.length > 0;

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Welcome to SGoAI</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasStarted ? (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Choose Your AI Assistant:</h3>
              <div className="grid grid-cols-2 gap-4">
                {aiModes.map((mode) => renderModeCard(mode))}
              </div>
            </div>

            {selectedMode && renderInterests()}
            {selectedMode &&
              selectedInterests.length > 0 &&
              renderTravelStatus()}

            {canProceed && (
              <Button
                className="w-full"
                onClick={handleStartExperience}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Start My Personalized Experience
              </Button>
            )}
          </div>
        ) : (
          renderChat()
        )}
      </CardContent>
    </Card>
  );
}
