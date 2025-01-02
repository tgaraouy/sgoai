// src/data/emergencyPhrases.ts
export interface EmergencyPhrase {
  id: string;
  darija: string;
  phonetic_transcription: string;
  translations: {
    english: string;
    french: string;
  };
  priority: "high" | "medium" | "low";
}

export const EMERGENCY_PHRASES: Record<string, EmergencyPhrase[]> = {
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

export const EMERGENCY_NUMBERS = {
  police: "190",
  ambulance: "150",
  emergency: "112",
} as const;
