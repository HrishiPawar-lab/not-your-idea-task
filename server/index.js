import express from "express";
import mongoose from "mongoose";
import taskRoutes from "./routes/tasks.js";
import authRoutes from "./routes/auth.js";
import auditRoutes from "./routes/audit.js";
import dotenv from "dotenv"
import connectToServer from "./connectToServer.js";
import cors from "cors";
// Load environment variables from .env file
dotenv.config();


export const PORT = process.env.PORT || 3000
export const app = express();

// Middleware
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/audit", auditRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        connectToServer();
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error(err)
    });
