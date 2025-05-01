const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
app.use(bodyParser.json({ strict: false })); // Allow empty JSON bodies

const client = twilio("AC4f50bca190b22f65073655122498502f", "8190c3dd22a4ba585fe507638b3b7532");

// WhatsApp-enabled Twilio number
const fromWhatsAppNumber = 'whatsapp:+14155238886'; // Twilio Sandbox or live number

// Customer's WhatsApp number
const toWhatsAppNumber = 'whatsapp:+917395967936'; // Recipient number

app.post('/api/outbound-message', async (req, res) => {
  const messageBody = 
    `Good day Prabhu Dhanabal and welcome to ANS Pride. ` +
    `You’ve successfully checked in on 2025-05-01 at 11:30 AM. ` +
    `Your room number is 303, AC Suite. ` +
    `Check-out is scheduled for 2025-05-02 at 11:00 AM. ` +
    `We hope you enjoy your stay! Please let us know if you need anything during your stay.`;

  try {
    const message = await client.messages.create({
      from: fromWhatsAppNumber,
      to: toWhatsAppNumber,
      body: messageBody,
      mediaUrl: ['https://iili.io/3h3AyDG.png'] // must be HTTPS
    });

    console.log('✅ Message sent:', message.sid);
    res.status(200).send({ success: true, sid: message.sid });
  } catch (err) {
    console.error('❌ Twilio error:', err);
    res.status(500).send({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('API listening on port 3000');
});
