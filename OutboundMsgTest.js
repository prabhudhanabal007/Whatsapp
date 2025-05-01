const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const client = twilio("AC4f50bca190b22f65073655122498502f", "8190c3dd22a4ba585fe507638b3b7532");

// WhatsApp-enabled Twilio number
const fromWhatsAppNumber = 'whatsapp:+14155238886'; // Twilio Sandbox or live number

// Customer's WhatsApp number
const toWhatsAppNumber = 'whatsapp:+919884831723'; // Replace with actual recipient

// POST API to send WhatsApp message
app.post('/api/outbound-message', async (req, res) => {
    client.messages
  .create({
    from: fromWhatsAppNumber,
    to: toWhatsAppNumber,
    contentSid: 'HXd4585a275ef1abff2a710e8e8183f404', // SID of your approved content template
    contentVariables: JSON.stringify({
        guest_name: 'Prabhu Dhanabal',
        hotel_name: '2025-05-02',
        check_in_date: '2025-05-01',
        check_in_time: '11:30 AM',
        room_number: '303',
        room_type:'AC Suite',
        check_out_date: '2025-05-02',
        check_out_time: '11:00 AM'
    }),
  })
  .then(message => console.log('✅ Message sent:', message.sid))
  .catch(err => console.error('❌ Error:', err));
});

app.listen(3000, () => {
    console.log('API listening on port 3000');
});
