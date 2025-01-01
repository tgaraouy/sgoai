// src/components/learn/LearningCard.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2 } from "lucide-react";
import React from "react";

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

interface LearningCardProps {
  phrase: DarijaPhrase;
  onMastery: (level: number) => void;
  showTranslation: boolean;
  onToggleTranslation: () => void;
}

export const LearningCard: React.FC<LearningCardProps> = ({
  phrase,
  onMastery,
  showTranslation,
  onToggleTranslation,
}) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Darija Text */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <p className="text-3xl font-arabic">{phrase.darija}</p>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Volume2 className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <p className="text-lg text-gray-600">
            {phrase.phonetic_transcription}
          </p>
        </div>

        {/* Translation */}
        <div className="text-center">
          {showTranslation ? (
            <>
              <p className="text-xl mb-2">{phrase.translations.english}</p>
              <p className="text-gray-600">{phrase.translations.french}</p>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={onToggleTranslation}
              className="w-full"
            >
              Show Translation
            </Button>
          )}
        </div>

        {/* Mastery Buttons */}
        {showTranslation && (
          <div className="space-y-3">
            <p className="text-center text-sm text-gray-600 mb-2">
              How well did you know this phrase?
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={() => onMastery(1)}
                className="w-full"
              >
                Still Learning
              </Button>
              <Button
                variant="outline"
                onClick={() => onMastery(2)}
                className="w-full"
              >
                Almost There
              </Button>
              <Button onClick={() => onMastery(3)} className="w-full">
                Mastered
              </Button>
            </div>
          </div>
        )}

        {/* Usage Examples */}
        {showTranslation && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Usage Examples:</h3>
            <ul className="space-y-2">
              {phrase.usage_contexts.situational_examples.map(
                (example, index) => (
                  <li key={index} className="text-gray-600 text-sm">
                    • {example}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};
