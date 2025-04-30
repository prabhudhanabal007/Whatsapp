const express = require('express');
const bodyParser = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Incoming message handler
app.post('/webhook', (req, res) => {
  const incomingMsg = req.body.Body;
  const from = req.body.From;

  console.log(`Received message from ${from}: ${incomingMsg}`);

  const twiml = new MessagingResponse();
  twiml.message(`Hi! We received your message: "${incomingMsg}"`);

  res.set('Content-Type', 'text/xml');
  res.send(twiml.toString());
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
