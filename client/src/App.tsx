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

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/rps" component={RPS} />
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
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
            <AppRouter />
          </TooltipProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;