// src/lib/location/locationManager.ts
export interface Location {
  city: string;
  area: string;
  type: "medina" | "new_city" | "market" | "beach" | "tourist_area";
}

export interface LocationSuggestion {
  location: Location;
  suggestedPhrases: string[];
  contextualTips: string[];
}

export const MOROCCAN_CITIES = {
  Marrakech: ["Medina", "Gueliz", "Hivernage"],
  Fes: ["Medina", "Ville Nouvelle", "Borj Sud"],
  Casablanca: ["Ain Diab", "Maarif", "Anfa"],
  Rabat: ["Medina", "Agdal", "Hassan"],
} as const;

export const locationManager = {
  getCurrentLocation: async (): Promise<Location | null> => {
    try {
      if (typeof window === "undefined" || !navigator.geolocation) {
        throw new Error("Geolocation not available");
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      // Mock location for demo
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

  getLocationSuggestions: async (
    location: Location
  ): Promise<LocationSuggestion> => {
    return {
      location,
      suggestedPhrases: ["fin_souk", "bghit_taxi", "chhal_hada", "shukran"],
      contextualTips: [
        "Prices are typically negotiable in the medina",
        "Always agree on taxi fare before starting the journey",
        "Keep small bills handy for easier transactions",
      ],
    };
  },
};
