require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectToDB = require("./config/database.js");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: true,
    credentials: true
}));

// Database connection
let dbConnected = false;

app.use(async (req, res, next) => {
    try {
        if (!dbConnected) {
            await connectToDB();
            dbConnected = true;
        }
        next();
    } catch (error) {
        console.error("Database connection failed:", error);
        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

// Routes
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "InterGen AI Backend is running!"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "API is working"
    });
});

module.exports = app;