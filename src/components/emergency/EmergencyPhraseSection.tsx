// src/components/emergency/EmergencyPhraseSection.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { EMERGENCY_NUMBERS, EMERGENCY_PHRASES } from "@/data/emergencyPhrases";
import { AlertTriangle, Copy } from "lucide-react";
import { useState } from "react";

export function EmergencyPhraseSection() {
  const [showEmergency, setShowEmergency] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: `Emergency number ${text} copied to clipboard`,
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      toast({
        title: "Failed to copy",
        description: "Please try copying manually",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-4">
      <Button
        variant="destructive"
        className="w-full"
        onClick={() => setShowEmergency(!showEmergency)}
      >
        <AlertTriangle className="mr-2 h-4 w-4" />
        Emergency Phrases & Numbers
      </Button>

      {showEmergency && (
        <Card className="mt-4 p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(EMERGENCY_NUMBERS).map(([service, number]) => (
                <div
                  key={service}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <div className="font-medium capitalize">{service}</div>
                    <div className="text-lg">{number}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(number)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {Object.entries(EMERGENCY_PHRASES).map(([category, phrases]) => (
                <div key={category}>
                  <h3 className="font-medium capitalize mb-2">{category}</h3>
                  <div className="space-y-2">
                    {phrases.map((phrase) => (
                      <Card key={phrase.id} className="p-3">
                        <div className="font-arabic text-lg mb-1">
                          {phrase.darija}
                        </div>
                        <div className="text-sm text-gray-600">
                          {phrase.phonetic_transcription}
                        </div>
                        <div className="text-sm mt-1">
                          {phrase.translations.english}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
