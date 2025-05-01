const express = require('express');
const bodyParser = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Incoming message handler
app.post('/api/inbound-webhook', (req, res) => {
  const incomingMsg = req.body.Body;
  const from = req.body.From;

  console.log(`Received message from ${from}: ${incomingMsg}`);

  const roomNumber = "303";
  const guest_name = "Prabhu Dhanabal";
  const twiml = new MessagingResponse();

  // Simple routing logic based on requestType
  let responseText = '';
  switch (incomingMsg.toLowerCase()) {
      case '1':
          responseText = `Thank you, ${guest_name}! We have received your room service request for Room ${roomNumber}.Housekeeping has been notified.They will reach you shortly`;
          twiml.message(responseText);
          break;
      case '2':
          responseText = `Thank you, ${guest_name}! We have received your maintenance request for Room ${roomNumber}.Maintenance team has been alerted.They will reach you shortly`;
          twiml.message(responseText);
          break;
      case '3':
        try {
            const call = client.calls.create({
              twiml: '<Response><Say>Connecting you to the front desk. Please hold.</Say><Dial>+919876543210</Dial></Response>',
              to: '+919884831723', // Customer's phone number (must be voice-capable)
              from: '+14155238886'  // Your Twilio voice-enabled number
            });
      
            console.log('📞 Voice call initiated:', call.sid);
            res.status(200).send({ success: true, sid: call.sid });
          } catch (err) {
            console.error('❌ Call failed:', err.message);
            res.status(500).send({ error: err.message });
          }
            break;
      case 'general':
          responseText = `Room ${roomNumber}: Thank you for your message. Guest Services will respond shortly.`;
          twiml.message(responseText);
          break;
      default:
          responseText = `Room ${roomNumber}: Unrecognized request type. Please contact Guest Services.`;
          twiml.message(responseText);
          break;
  }
  res.set('Content-Type', 'text/xml');
  res.send(twiml.toString());

});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
