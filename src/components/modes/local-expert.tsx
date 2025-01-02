"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  Calendar,
  Clock,
  Coffee,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import React from "react";

interface Location {
  id: string;
  name: string;
  type: string;
  bestTime: string;
  tips: string[];
  safety: string;
}

export function LocalExpert() {
  const [selectedCity, setSelectedCity] = React.useState<string | null>(null);
  const [currentTime, setCurrentTime] = React.useState<string>("");
  const [locations, setLocations] = React.useState<Location[]>([]);

  React.useEffect(() => {
    // Update current local time
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Africa/Casablanca",
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const cities = [
    "Marrakech",
    "Fes",
    "Casablanca",
    "Tangier",
    "Rabat",
    "Chefchaouen",
  ];

  const categories = [
    { icon: Coffee, label: "Cafes & Restaurants" },
    { icon: ShoppingBag, label: "Shopping & Souks" },
    { icon: MapPin, label: "Attractions" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span>Local Time: {currentTime}</span>
          </div>
          <AlertCircle className="h-5 w-5 text-blue-500" />
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Select City:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {cities.map((city) => (
            <Button
              key={city}
              variant={selectedCity === city ? "default" : "outline"}
              onClick={() => setSelectedCity(city)}
              className="justify-start"
            >
              <MapPin className="h-4 w-4 mr-2" />
              {city}
            </Button>
          ))}
        </div>
      </div>

      {selectedCity && (
        <>
          <div>
            <h3 className="font-medium mb-2">{"What are you looking for?"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card
                  key={category.label}
                  className="p-4 cursor-pointer hover:border-blue-500"
                >
                  <div className="flex flex-col items-center text-center">
                    <category.icon className="h-6 w-6 mb-2 text-blue-500" />
                    <span>{category.label}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">{"Best Times to Visit:"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium">{"Today's Recommendation"}</h4>
                    <p className="text-sm text-gray-600">
                      {"Best times to visit attractions and avoid crowds"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
