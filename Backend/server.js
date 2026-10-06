require("dotenv").config()
const dns = require("dns")
const app = require("./src/app.js")

dns.setServers(["1.1.1.1", "8.8.8.8"])

// Sirf local pe listen karo (Vercel pe nahi)
if (require.main === module) {
    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    })
}

module.exports = app