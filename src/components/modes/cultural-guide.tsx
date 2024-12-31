"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Info, Users, Utensils } from "lucide-react";
import React from "react";

interface CulturalTopic {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  examples: string[];
}

const culturalTopics: CulturalTopic[] = [
  {
    id: "greetings",
    title: "Greetings & Etiquette",
    icon: Users,
    description: "Learn proper Moroccan greetings and social customs",
    examples: [
      "How to greet elders",
      "Gender-specific etiquette",
      "Common social faux pas",
    ],
  },
  {
    id: "dining",
    title: "Dining Customs",
    icon: Utensils,
    description: "Understanding Moroccan dining etiquette",
    examples: [
      "Eating with right hand",
      "Communal dining norms",
      "Ramadan customs",
    ],
  },
  {
    id: "customs",
    title: "Religious & Social Customs",
    icon: Calendar,
    description: "Important customs and traditions",
    examples: [
      "Mosque etiquette",
      "Dress code guidelines",
      "Photography etiquette",
    ],
  },
];

export function CulturalGuide() {
  const [selectedTopic, setSelectedTopic] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleTopicSelect = async (topicId: string) => {
    setIsLoading(true);
    setSelectedTopic(topicId);
    // API call for specific cultural information
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {culturalTopics.map((topic) => (
          <Card
            key={topic.id}
            className={`p-4 cursor-pointer hover:border-blue-500 transition-all ${
              selectedTopic === topic.id ? "border-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => handleTopicSelect(topic.id)}
          >
            <div className="flex flex-col items-center text-center">
              <topic.icon className="h-8 w-8 mb-2 text-blue-500" />
              <h3 className="font-medium">{topic.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {selectedTopic && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Common Questions:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {culturalTopics
              .find((t) => t.id === selectedTopic)
              ?.examples.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    /* Handle question */
                  }}
                >
                  <Info className="h-4 w-4 mr-2" />
                  {example}
                </Button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
