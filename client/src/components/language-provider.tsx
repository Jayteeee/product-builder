import { createContext, useContext, useEffect, useState } from "react";
import { translations, type Language } from "@/lib/i18n";

type LanguageProviderProps = {
  children: React.ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
};

type LanguageProviderState = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations["ko"]) => string;
};

const initialState: LanguageProviderState = {
  language: "ko",
  setLanguage: () => null,
  t: (key) => translations["ko"][key] || key,
};

const LanguageProviderContext = createContext<LanguageProviderState>(initialState);

export function LanguageProvider({
  children,
  defaultLanguage = "ko",
  storageKey = "lunch_lang",
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem(storageKey) as Language) || defaultLanguage
  );

  useEffect(() => {
    localStorage.setItem(storageKey, language);
    document.documentElement.lang = language;
  }, [language, storageKey]);

  const value = {
    language,
    setLanguage,
    t: (key: keyof typeof translations["ko"]) => translations[language][key] || key,
  };

  return (
    <LanguageProviderContext.Provider value={value}>
      {children}
    </LanguageProviderContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext);

  if (context === undefined)
    throw new Error("useLanguage must be used within a LanguageProvider");

  return context;
};
