// src/components/modes/tourist-darija.tsx
import { EmergencyPhraseSection } from "@/components/emergency/EmergencyPhraseSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/db/supabase";
import { locationManager } from "@/lib/location/locationManager";
import { offlineManager } from "@/lib/storage/offlineManager";
import {
  AlertTriangle,
  Bookmark,
  Car,
  ChevronRight,
  Coffee,
  Hotel,
  Map,
  MapPin,
  MessageCircle,
  ShoppingCart,
  Star,
  Utensils,
  Volume2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const TOURIST_SCENARIOS = [
  {
    id: "cafe",
    name: "Café & Drinks",
    icon: Coffee,
    color: "text-brown-500",
    priority: 1,
  },
  {
    id: "shopping",
    name: "Shopping & Haggling",
    icon: ShoppingCart,
    color: "text-green-500",
    priority: 1,
  },
  {
    id: "transport",
    name: "Taxis & Transport",
    icon: Car,
    color: "text-yellow-500",
    priority: 1,
  },
  {
    id: "restaurant",
    name: "Restaurants",
    icon: Utensils,
    color: "text-red-500",
    priority: 1,
  },
  {
    id: "directions",
    name: "Asking Directions",
    icon: Map,
    color: "text-blue-500",
    priority: 1,
  },
  {
    id: "hotel",
    name: "Hotel & Accommodation",
    icon: Hotel,
    color: "text-purple-500",
    priority: 2,
  },
];

interface DarijaPhrase {
  id: string;
  darija: string;
  phonetic_transcription: string;
  translations: {
    english: string;
    french: string;
  };
  category: {
    english: string;
  };
  scenario: {
    english: string;
  };
  usage_contexts: {
    situational_examples: string[];
  };
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function TouristDarija() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [phrases, setPhrases] = useState<DarijaPhrase[]>([]);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<any | null>(
    null
  );
  const [savedPhrases, setSavedPhrases] = useState<DarijaPhrase[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showSaved, setShowSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved phrases
    setSavedPhrases(offlineManager.getSavedPhrases());

    // Set up online/offline detection
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Get location-based suggestions
    loadLocationSuggestions();

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

  const loadLocationSuggestions = async () => {
    try {
      const location = await locationManager.getCurrentLocation();
      if (location) {
        const suggestions = await locationManager.getLocationSuggestions(
          location
        );
        setLocationSuggestions(suggestions);
      }
    } catch (error) {
      console.error("Error loading location suggestions:", error);
    }
  };

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

  const handleAIHelp = async () => {
    if (!phrases[currentPhraseIndex]) return;

    setLoading(true);
    const phrase = phrases[currentPhraseIndex];

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are a helpful Moroccan local helping tourists use Darija phrases. 
              Give short, practical advice about using this phrase: "${phrase.darija}" (${phrase.translations.english})`,
            },
            {
              role: "user",
              content: "How and when exactly should I use this phrase?",
            },
          ],
        }),
      });

      if (!response.ok) throw new Error("Failed to get help");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
      setShowChat(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get help",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const handleRemoveSavedPhrase = (phraseId: string) => {
    const removed = offlineManager.removePhrase(phraseId);
    if (removed) {
      setSavedPhrases(offlineManager.getSavedPhrases());
      toast({
        title: "Phrase Removed",
        description: "Phrase removed from saved list",
      });
    }
  };

  const renderLocationSuggestions = () => {
    if (!locationSuggestions) return null;

    return (
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="text-primary" />
          <h3 className="font-medium">
            Useful phrases for {locationSuggestions.location.area}
          </h3>
        </div>
        <div className="space-y-2">
          {locationSuggestions.contextualTips.map(
            (tip: string, index: number) => (
              <p key={index} className="text-sm text-gray-600">
                {tip}
              </p>
            )
          )}
        </div>
      </Card>
    );
  };

  const renderSavedPhrases = () => {
    if (!showSaved) return null;

    return (
      <Card className="p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Saved Phrases</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowSaved(false)}>
            Close
          </Button>
        </div>
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
                    onClick={() => handleRemoveSavedPhrase(phrase.id)}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>
    );
  };

  if (!selectedScenario) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Quick Phrases</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowSaved(!showSaved)}>
              <Bookmark className="w-4 h-4 mr-2" />
              Saved ({savedPhrases.length})
            </Button>
          </div>
        </div>

        {isOffline && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              {"You're offline. Using saved phrases only."}
            </p>
          </div>
        )}

        {renderSavedPhrases()}
        {renderLocationSuggestions()}
        <EmergencyPhraseSection />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {TOURIST_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              className="p-6 border rounded-lg hover:border-primary transition-colors flex flex-col items-center gap-3"
            >
              <scenario.icon className={`w-8 h-8 ${scenario.color}`} />
              <span className="text-lg font-medium">{scenario.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentPhrase = phrases[currentPhraseIndex];

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => {
            setSelectedScenario(null);
            setShowChat(false);
            setMessages([]);
          }}
          className="mr-4"
        >
          ← Back
        </Button>
        <h2 className="text-xl font-semibold">
          {TOURIST_SCENARIOS.find((s) => s.id === selectedScenario)?.name}
        </h2>
      </div>

      {currentPhrase ? (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center items-center gap-3 mb-4">
                <p className="text-3xl font-arabic">{currentPhrase.darija}</p>
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

            {showChat && (
              <ScrollArea className="h-[200px] border rounded-lg p-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            )}

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button onClick={handleAIHelp} disabled={loading}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Help Me Use This
                </Button>
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
              </div>
              <Button
                onClick={() => {
                  setCurrentPhraseIndex((prev) =>
                    prev < phrases.length - 1 ? prev + 1 : 0
                  );
                  setShowChat(false);
                  setMessages([]);
                }}
              >
                Next Phrase
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No phrases available for this scenario
        </p>
      )}

      {/* Floating Emergency Button */}
      <div className="fixed bottom-4 right-4">
        <Button
          variant="destructive"
          size="lg"
          className="rounded-full shadow-lg"
          onClick={() => {
            setSelectedScenario(null);
            setShowChat(false);
            setMessages([]);
            // Scroll to emergency section
            document.querySelector(".emergency-section")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          <AlertTriangle className="w-5 h-5 mr-2" />
          Emergency Phrases
        </Button>
      </div>

      {/* Network Status Indicator */}
      {isOffline && (
        <div className="fixed bottom-4 left-4">
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            Offline Mode
          </div>
        </div>
      )}
    </div>
  );
}
