import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { DBConnection } from "./database/dbConnection.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";

const app = express();

DBConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // your Vite frontend URL
  credentials: true
}));
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/problems", problemRoutes);
app.use("/submissions", submissionRoutes);

app.get("/", (req, res) => {
  res.send("Ping");
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
