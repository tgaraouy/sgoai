// src/scripts/populate-supabase.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import Papa from "papaparse";
import path from "path";
import type { Database } from "../types/supabase";

// Load environment variables
dotenv.config();

// Verify environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing required environment variables:");
  if (!supabaseUrl) console.error("- NEXT_PUBLIC_SUPABASE_URL");
  if (!supabaseKey) console.error("- SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

console.log("Environment variables loaded successfully");

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

interface CSVRow {
  darija: string;
  phoneticTranscription: string;
  "translations.english": string;
  "translations.french": string;
  "translations.spanish": string;
  "translations.italian": string;
  "translations.german": string;
  "category.english": string;
  "category.french": string;
  "category.spanish": string;
  "category.italian": string;
  "category.german": string;
  "scenario.english": string;
  "scenario.french": string;
  "scenario.spanish": string;
  "scenario.italian": string;
  "scenario.german": string;
  pictureLink: string;
  likes: number;
  difficulty: string;
  cultural_context: string;
  meaning_details: string;
  usage_contexts: string;
  related_content: string;
  [key: string]: any;
}

function parseJsonString(str: string): any {
  if (!str) return {};

  try {
    // First attempt: Try direct parsing after cleaning simple quotes
    let cleanStr = str
      .replace(/'/g, '"')
      .replace(/\n/g, "\\n")
      .replace(/\\"/g, '\\"');

    try {
      return JSON.parse(cleanStr);
    } catch (e) {
      // If direct parsing fails, try to parse as a Python-style dict
      cleanStr = str
        .replace(/'/g, '"')
        .replace(/None/g, "null")
        .replace(/True/g, "true")
        .replace(/False/g, "false")
        .replace(/(\w+):/g, '"$1":') // Add quotes to keys
        .replace(/\s+/g, " ") // Normalize whitespace
        .replace(/\\n/g, " ") // Replace newlines
        .replace(/\\/g, "\\\\"); // Escape backslashes

      // Handle the specific structure in your CSV
      if (cleanStr.includes("explanation")) {
        const structuredObj = {
          explanation: extractValue(cleanStr, "explanation"),
          examples: extractArray(cleanStr, "examples"),
          cultural_notes: extractArray(cleanStr, "cultural_notes"),
        };
        return structuredObj;
      }

      if (cleanStr.includes("literal")) {
        const structuredObj = {
          literal: extractValue(cleanStr, "literal"),
          figurative: extractValue(cleanStr, "figurative"),
          variations: extractArray(cleanStr, "variations"),
          similar_phrases: extractArray(cleanStr, "similar_phrases"),
        };
        return structuredObj;
      }

      if (cleanStr.includes("formal")) {
        const structuredObj = {
          formal: extractArray(cleanStr, "formal"),
          informal: extractArray(cleanStr, "informal"),
          regional_variations: extractArray(cleanStr, "regional_variations"),
          situational_examples: extractArray(cleanStr, "situational_examples"),
        };
        return structuredObj;
      }

      if (cleanStr.includes("synonyms")) {
        const structuredObj = {
          synonyms: extractArray(cleanStr, "synonyms"),
          antonyms: extractArray(cleanStr, "antonyms"),
          related_phrases: extractArray(cleanStr, "related_phrases"),
          common_combinations: extractArray(cleanStr, "common_combinations"),
        };
        return structuredObj;
      }

      return {};
    }
  } catch (error) {
    console.error(
      "Failed to parse JSON string:",
      str.substring(0, 100) + "..."
    );
    return {};
  }
}

function extractValue(str: string, key: string): string {
  const regex = new RegExp(`"${key}":\\s*"([^"]*)"`, "i");
  const match = str.match(regex);
  return match ? match[1] : "";
}

function extractArray(str: string, key: string): string[] {
  try {
    const regex = new RegExp(`"${key}":\\s*\\[(.*?)\\]`, "i");
    const match = str.match(regex);
    if (!match) return [];

    const arrayStr = match[1];
    return arrayStr
      .split(",")
      .map((item) => item.trim())
      .map((item) => item.replace(/^["']|["']$/g, ""))
      .filter((item) => item.length > 0);
  } catch (e) {
    return [];
  }
}

async function populateDatabase() {
  const csvPath = path.join(process.cwd(), "data", "SGoAI-dataset.csv");

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found at: ${csvPath}`);
    console.log("Please ensure the file is in the correct location.");
    process.exit(1);
  }

  const fileContent = fs.readFileSync(csvPath, "utf8");
  console.log("CSV file loaded successfully");

  const results = Papa.parse<CSVRow>(fileContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  if (results.errors && results.errors.length > 0) {
    console.error("CSV parsing errors:", results.errors);
    process.exit(1);
  }

  if (!results.data || results.data.length === 0) {
    console.error("No data found in CSV");
    process.exit(1);
  }

  console.log(`Found ${results.data.length} rows to process`);

  const transformedData = results.data.map((row) => ({
    darija: row.darija,
    phonetic_transcription: row.phoneticTranscription,
    translations: {
      english: row["translations.english"],
      french: row["translations.french"],
      spanish: row["translations.spanish"],
      italian: row["translations.italian"],
      german: row["translations.german"],
    },
    category: {
      english: row["category.english"],
      french: row["category.french"],
      spanish: row["category.spanish"],
      italian: row["category.italian"],
      german: row["category.german"],
    },
    scenario: {
      english: row["scenario.english"],
      french: row["scenario.french"],
      spanish: row["scenario.spanish"],
      italian: row["scenario.italian"],
      german: row["scenario.german"],
    },
    difficulty: row.difficulty?.toLowerCase() || "beginner",
    picture_link: row.pictureLink,
    likes: row.likes || 0,
    cultural_context: parseJsonString(row.cultural_context),
    meaning_details: parseJsonString(row.meaning_details),
    usage_contexts: parseJsonString(row.usage_contexts),
    related_content: parseJsonString(row.related_content),
    metadata: {
      formality_level: "formal",
      age_group: "all",
      gender_specific: false,
      regional_preference: "nationwide",
      frequency_of_use: "high",
      social_context: ["general", "tourist"],
    },
  }));

  // Insert data in batches
  const BATCH_SIZE = 50;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < transformedData.length; i += BATCH_SIZE) {
    try {
      const batch = transformedData.slice(i, i + BATCH_SIZE);
      const { data, error } = await supabase
        .from("darija_phrases")
        .insert(batch)
        .select();

      if (error) {
        console.error(
          `Error inserting batch ${Math.floor(i / BATCH_SIZE) + 1}:`,
          error
        );
        errorCount += batch.length;
      } else {
        console.log(
          `Successfully inserted batch ${Math.floor(i / BATCH_SIZE) + 1}`
        );
        successCount += batch.length;
      }

      // Add a small delay between batches to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(
        `Error processing batch ${Math.floor(i / BATCH_SIZE) + 1}:`,
        error
      );
      errorCount += BATCH_SIZE;
    }
  }

  console.log("\nPopulation Summary:");
  console.log(`Total rows processed: ${transformedData.length}`);
  console.log(`Successfully inserted: ${successCount}`);
  console.log(`Failed to insert: ${errorCount}`);
}

// Run the population script
populateDatabase()
  .then(() => {
    console.log("Database population completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error populating database:", error);
    process.exit(1);
  });
