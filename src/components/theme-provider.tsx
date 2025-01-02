// src/components/theme-provider.tsx
"use client";

import type { ThemeProviderProps as NextThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps extends NextThemeProviderProps {}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
