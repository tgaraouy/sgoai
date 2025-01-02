// src/components/modes/language-tutor.tsx
import { AIAssistant } from "@/components/core/ai-assistant";
import { LearningCard } from "@/components/learn/LearningCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DarijaPhrase,
  getPhrases,
  updateLearningProgress,
} from "@/lib/db/queries";
import { useEffect, useState } from "react";

interface LearningMode {
  key: string;
  title: string;
  component: React.ReactNode;
}

export function LanguageTutor() {
  const [mode, setMode] = useState<string>("interactive");

  const learningModes: Record<string, LearningMode> = {
    interactive: {
      key: "interactive",
      title: "Interactive Chat",
      component: <AIAssistant initialMode="tutor" />,
    },
    structured: {
      key: "structured",
      title: "Structured Learning",
      component: <LearningSession />,
    },
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center gap-4 mb-6">
        {Object.values(learningModes).map((m) => (
          <Button
            key={m.key}
            variant={mode === m.key ? "default" : "outline"}
            onClick={() => setMode(m.key)}
            className="min-w-[150px]"
          >
            {m.title}
          </Button>
        ))}
      </div>

      <div className="mt-6">{learningModes[mode]?.component}</div>
    </div>
  );
}

function LearningSession() {
  const [phrases, setPhrases] = useState<DarijaPhrase[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    loadPhrases();
  }, []);

  const loadPhrases = async () => {
    const data = await getPhrases();
    setPhrases(data);
  };

  const handleMastery = async (level: number) => {
    if (!phrases[currentIndex]) return;

    await updateLearningProgress({
      userId: "current_user_id",
      phraseId: phrases[currentIndex].id,
      mastery: level,
    });

    setCurrentIndex((prev) => prev + 1);
    setShowTranslation(false);
  };

  if (!phrases[currentIndex]) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Session Complete!</h2>
        <Button onClick={() => setCurrentIndex(0)}>Start New Session</Button>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <LearningCard
        phrase={phrases[currentIndex]}
        onMastery={handleMastery}
        showTranslation={showTranslation}
        onToggleTranslation={() => setShowTranslation(true)}
      />
    </div>
  );
}
