const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Twilio config
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
const fromWhatsAppNumber = 'whatsapp:+14155238886'; // Twilio sender

// API to schedule reminder
app.post('/api/schedule-checkout-reminder', (req, res) => {
  const {
    guest_name,
    whatsapp_number,
    check_out_datetime
  } = req.body;

  if (!guest_name || !whatsapp_number || !check_out_datetime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Calculate reminder time (1 hour before checkout)
  const checkoutTime = new Date(check_out_datetime);
  const reminderTime = new Date(checkoutTime.getTime() - 60 * 60 * 1000);

  if (reminderTime <= new Date()) {
    return res.status(400).json({ error: 'Checkout time is too soon or in the past' });
  }

  // Schedule the WhatsApp message
  schedule.scheduleJob(reminderTime, () => {
    client.messages
      .create({
        from: fromWhatsAppNumber,
        to: `whatsapp:${whatsapp_number}`,
        body: `Hello ${guest_name}, this is a reminder that your checkout is at ${checkoutTime.toLocaleTimeString()}. Please contact the front desk if you need anything before you leave.`
      })
      .then(message => console.log(`✅ Reminder sent to ${whatsapp_number}: ${message.sid}`))
      .catch(error => console.error(`❌ Error sending reminder:`, error));
  });

  res.json({ message: `Checkout reminder scheduled for ${guest_name} at ${reminderTime}` });
});

app.listen(3000, () => {
  console.log('🚀 Server listening on port 3000');
});
