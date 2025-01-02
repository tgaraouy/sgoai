// src/components/learn/LearningCard.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type DarijaPhrase } from "@/types/darija";
import { Volume2 } from "lucide-react";

interface LearningCardProps {
  phrase: DarijaPhrase;
  onMastery: (level: number) => void;
  showTranslation: boolean;
  onToggleTranslation: () => void;
}

export function LearningCard({
  phrase,
  onMastery,
  showTranslation,
  onToggleTranslation,
}: LearningCardProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <p className="text-3xl font-arabic">{phrase.darija}</p>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Volume2 className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <p className="text-lg text-gray-600 mb-2">
            {phrase.phonetic_transcription}
          </p>
          {showTranslation && (
            <>
              <p className="text-xl mb-1">{phrase.translations.english}</p>
              <p className="text-gray-600">{phrase.translations.french}</p>
            </>
          )}
        </div>

        {!showTranslation && (
          <Button
            onClick={onToggleTranslation}
            variant="outline"
            className="w-full"
          >
            Show Translation
          </Button>
        )}

        {showTranslation && (
          <div className="grid grid-cols-3 gap-2">
            <Button onClick={() => onMastery(1)} variant="outline">
              Still Learning
            </Button>
            <Button onClick={() => onMastery(2)} variant="outline">
              Almost There
            </Button>
            <Button onClick={() => onMastery(3)}>Mastered</Button>
          </div>
        )}
      </div>
    </Card>
  );
}
