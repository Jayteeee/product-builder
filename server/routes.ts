import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { recommendationRequestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get food recommendation based on user preferences
  app.post("/api/recommendations", async (req, res) => {
    try {
      const request = recommendationRequestSchema.parse(req.body);
      const recommendation = await storage.getFoodRecommendation(request);
      const alternatives = await storage.getAlternativeRecommendations(request.category, recommendation.id);
      
      res.json({
        recommendation,
        alternatives
      });
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid request parameters",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
