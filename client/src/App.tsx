import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import Home from "@/pages/home";
import About from "@/pages/about";
import Privacy from "@/pages/privacy";
import RPS from "@/pages/rps";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";

// Custom hook for hash-based routing
const useHashLocation = () => {
  const [loc, setLoc] = useState(window.location.hash.replace(/^#/, "") || "/");
  useEffect(() => {
    const handler = () => setLoc(window.location.hash.replace(/^#/, "") || "/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  const navigate = (to: string) => (window.location.hash = to);
  return [loc, navigate] as const;
};

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/rps" component={RPS} />
      <Route path="/about" component={About} />
      <Route path="/about.html" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/privacy.html" component={Privacy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LanguageProvider defaultLanguage="ko" storageKey="lunch_lang">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <WouterRouter hook={useHashLocation}>
              <AppRouter />
            </WouterRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;