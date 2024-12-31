// src/lib/location/locationManager.ts
interface Location {
  city: string;
  area: string;
  type: "medina" | "new_city" | "market" | "beach" | "tourist_area";
}

interface LocationSuggestion {
  location: Location;
  suggestedPhrases: string[];
  contextualTips: string[];
}

const MOROCCAN_CITIES = {
  Marrakech: ["Medina", "Gueliz", "Hivernage"],
  Fes: ["Medina", "Ville Nouvelle", "Borj Sud"],
  Casablanca: ["Ain Diab", "Maarif", "Anfa"],
  Rabat: ["Medina", "Agdal", "Hassan"],
  // Add more cities and areas
};

export const locationManager = {
  // Get current location context
  getCurrentLocation: async (): Promise<Location | null> => {
    try {
      // First try to get GPS location
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      // Here you would normally use a reverse geocoding service
      // For demo, we'll return a mock location
      return {
        city: "Marrakech",
        area: "Medina",
        type: "medina",
      };
    } catch (error) {
      console.error("Error getting location:", error);
      return null;
    }
  },

  // Get contextual suggestions based on location
  getLocationSuggestions: async (
    location: Location
  ): Promise<LocationSuggestion> => {
    // In a real app, this would come from your backend based on actual location
    return {
      location,
      suggestedPhrases: [
        "fin_souk", // where is the market
        "bghit_taxi", // I want a taxi
        "chhal_hada", // how much is this
        "shukran", // thank you
      ],
      contextualTips: [
        "Prices are typically negotiable in the medina",
        "Always agree on taxi fare before starting the journey",
        "Keep small bills handy for easier transactions",
      ],
    };
  },
};

// src/data/emergencyPhrases.ts
export const EMERGENCY_PHRASES = {
  medical: [
    {
      id: "emergency_doctor",
      darija: "محتاج طبيب",
      phonetic_transcription: "M-htaj tbib",
      translations: {
        english: "I need a doctor",
        french: "J'ai besoin d'un médecin",
      },
      priority: "high",
    },
    {
      id: "emergency_hospital",
      darija: "فين السبيطار",
      phonetic_transcription: "Fin sbitar",
      translations: {
        english: "Where is the hospital",
        french: "Où est l'hôpital",
      },
      priority: "high",
    },
  ],
  police: [
    {
      id: "emergency_police",
      darija: "عيطو للبوليس",
      phonetic_transcription: "3ayto l-boulis",
      translations: {
        english: "Call the police",
        french: "Appelez la police",
      },
      priority: "high",
    },
  ],
  help: [
    {
      id: "emergency_help",
      darija: "عاونوني",
      phonetic_transcription: "3awnouni",
      translations: {
        english: "Help me",
        french: "Aidez-moi",
      },
      priority: "high",
    },
  ],
};

// src/components/emergency/EmergencyPhraseSection.tsx
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone, Copy } from "lucide-react";

export function EmergencyPhraseSection() {
  const [showEmergency, setShowEmergency] = useState(false);

  const emergencyNumbers = {
    police: "190",
    ambulance: "150",
    emergency: "112",
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
            {/* Emergency Numbers */}
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(emergencyNumbers).map(([service, number]) => (
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

            {/* Emergency Phrases */}
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
