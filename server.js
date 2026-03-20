const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const app = express();
app.use(express.json());

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-zygote",
      "--disable-extensions",
      "--ignore-certificate-errors"
    ]
  },
  authTimeoutMs: 60000
});

client.on("qr", (qr) => {
  console.log("Scan QR Code:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("WhatsApp Bot Ready!");
});

client.on("auth_failure", msg => {
  console.error("AUTH FAILURE:", msg);
});

client.on("disconnected", reason => {
  console.log("Client disconnected:", reason);
});

client.initialize().catch(err => {
  console.error("Initialization error:", err);
});

app.post("/send-message", async (req, res) => {

  const { phone, message } = req.body;

  try {

    await client.sendMessage(`${phone}@c.us`, message);

    res.json({ success: true });

  } catch (err) {

    console.error("Send error:", err);
    res.status(500).json({ error: "Message failed" });

  }

});
app.get("/", (req, res) => {
  res.send("WhatsApp Bot Running");
});

app.listen(3000, () => {
  console.log("WhatsApp bot running on port 3000");
});
