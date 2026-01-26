import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initGA } from "@/lib/analytics";

// Initialize Analytics
initGA();

createRoot(document.getElementById("root")!).render(<App />);
