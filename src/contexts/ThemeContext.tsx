import { createContext, useContext } from "react";

export type ThemeMode = "light" | "dark";

type ThemeContextData = {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
};

export const ThemeContext = createContext<ThemeContextData>(
  {} as ThemeContextData,
);

export function useTheme() {
  return useContext(ThemeContext);
}
