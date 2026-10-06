const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const connectToDB = require("./config/database")

const app = express()

app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [process.env.FRONTEND_URL]

app.use(cors({
    origin: (origin, callback) => {
        const ok = !origin
            || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
            || allowedOrigins.includes(origin)
        callback(ok ? null : new Error("Origin not allowed by CORS"), ok)
    },
    credentials: true
}))

/* health check (DB pe depend nahi karta) */
app.get("/", (req, res) => res.json({ status: "ok" }))

/* DB connect (serverless ke liye, ek baar) */
let dbPromise
app.use(async (req, res, next) => {
    try {
        dbPromise = dbPromise || connectToDB()
        await dbPromise
        next()
    } catch (err) {
        dbPromise = null
        console.error("DB connection failed:", err.message)
        res.status(500).json({ message: "Database connection failed", error: err.message })
    }
})

/* routes */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

app.use("/api/auth", authRouter)
app.use("/api/interview/", interviewRouter)

module.exports = app