require("dotenv").config();
const app = require("./src/app.js")
const connectToDB = require("./src/config/database.js")
const dns = require("dns")


dns.setServers(["1.1.1.1", "8.8.8.8"]);
    
async function startServer() {
    try {
        await connectToDB()

        app.listen(3000, () => {
            console.log("Server is running on port 3000")
        })
    } catch (error) {
        console.error("Server startup failed because the database connection could not be established.", error)
        process.exitCode = 1
    }
}

startServer()
