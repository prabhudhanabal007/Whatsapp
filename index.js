const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// POST API to send WhatsApp message
app.post('/api/send-message', async (req, res) => {
    const { to, roomNumber, requestType, message } = req.body;

    if (!to || !requestType) {
        return res.status(400).json({ error: 'Missing required fields: to, requestType' });
    }

    // Simple routing logic based on requestType
    let responseText = '';
    switch (requestType.toLowerCase()) {
        case 'room_service':
            responseText = `Room ${roomNumber}: Room service request received. ${message || ''} Housekeeping has been notified.`;
            break;
        case 'maintenance':
            responseText = `Room ${roomNumber}: Maintenance request received. ${message || ''} Maintenance team has been alerted.`;
            break;
        case 'general':
            responseText = `Room ${roomNumber}: Thank you for your message. Guest Services will respond shortly. ${message || ''}`;
            break;
        default:
            responseText = `Room ${roomNumber}: Unrecognized request type. Please contact Guest Services.`;
            break;
    }

    try {
        await client.messages.create({
            body: responseText,
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:${to}`
        });
        res.status(200).json({ success: true, message: 'Message sent successfully.' });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => {
    console.log('API listening on port 3000');
});
