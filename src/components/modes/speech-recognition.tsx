"use client";

import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2 } from "lucide-react";
import React from "react";

interface SpeechRecognitionProps {
  targetPhrase: string;
  onResult: (result: string, confidence: number) => void;
}

export function SpeechRecognition({
  targetPhrase,
  onResult,
}: SpeechRecognitionProps) {
  const [isListening, setIsListening] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "ar-MA"; // Moroccan Arabic

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      onResult(result, confidence);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          onClick={startListening}
          disabled={isListening}
          className="flex items-center gap-2"
        >
          {isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
          {isListening ? "Listening..." : "Start Speaking"}
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            /* Implement text-to-speech */
          }}
          className="flex items-center gap-2"
        >
          <Volume2 className="h-4 w-4" />
          Hear Pronunciation
        </Button>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
}
