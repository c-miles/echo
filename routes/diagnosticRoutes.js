import express from "express";
import mongoose from "mongoose";
import { User } from "../models/User.js";

const router = express.Router();

// Test endpoint to check server health
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      hasApiBaseUrl: !!process.env.REACT_APP_API_BASE_URL,
    },
    mongodb: {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
    }
  });
});

// Test user creation with detailed error reporting
router.post("/test-user", async (req, res) => {
  try {
    console.log("Test user creation - received body:", req.body);
    
    const testData = {
      id: req.body.id || "test-" + Date.now(),
      email: req.body.email || "test@example.com",
      picture: req.body.picture || "https://example.com/pic.jpg"
    };
    
    console.log("Creating user with data:", testData);
    
    const newUser = new User(testData);
    const savedUser = await newUser.save();
    
    console.log("User saved successfully:", savedUser);
    
    res.json({
      success: true,
      user: savedUser,
      debug: {
        receivedBody: req.body,
        createdData: testData,
        mongooseValidation: newUser.validateSync()
      }
    });
  } catch (error) {
    console.error("Test user creation error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      errorName: error.name,
      errorCode: error.code,
      validationErrors: error.errors,
      stack: error.stack
    });
  }
});

export default router;