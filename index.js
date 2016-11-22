const gpio = require('pigpio').Gpio;
const express = require('express');
const valve = new gpio(17, {mode: gpio.INPUT});
const app = express();
let waterTimeout;

app.get('/status', (req, res) => {
  let watering = !!valve.digitalRead();
  res.json({watering});
});

app.get('/water', (req, res) => {
  let seconds = req.query.seconds * 1000;

  // Handle existing timeout
  waterTimeout && !waterTimeout._called && console.log('*** Clearing existing timeout ***')
  clearTimeout(waterTimeout);

  // Open the valve!
  valve.digitalWrite(1);
  console.log(`Valve open. Watering the garden for ${req.query.seconds} seconds.`);

  // Set a timeout to close the valve
  waterTimeout = setTimeout(() => {
    valve.digitalWrite(0);
    console.log(`Valve closed. Finished watering garden.`);
  }, seconds);

  res.status(200);
});

app.listen(80);
