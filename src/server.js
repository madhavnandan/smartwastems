const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const hbs = require('hbs');

const app = express();
const port = 3000 || process.env.PORT;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Store the last distance received from the NodeMCU
let lastDistance = null;

const staticpath = path.join(__dirname, '../public');
app.use(express.static(staticpath));//built in middleware//use to serve style file and others
//use template folder//use views engine
const tempaltePath = path.join(__dirname, '../templates/views');//change views folder to template
const partialsPath = path.join(__dirname, '../templates/partials');//partials path

app.set("view engine", "hbs");
app.set('views', tempaltePath); //change views folder
hbs.registerPartials(partialsPath);//register partial

// POST route to receive ultrasonic sensor data
app.post('/api/ultrasonic', (req, res) => {
  const { distance } = req.body;
  
  if (distance !== undefined) {
    lastDistance = distance; // Store the latest distance
    console.log(`Received distance: ${distance} cm`);
    res.status(200).send({ message: 'Data received successfully' });
  } else {
    res.status(400).send({ message: 'Invalid data' });
  }
});

// GET route to serve the last recorded distance
app.get('/distance', (req, res) => {
  if (lastDistance !== null) {
    res.status(200).json({ distance: lastDistance , wasteLevel: 100 - Math.round((lastDistance / 55) * 100)});
  } else {
    res.status(404).send({ message: 'No data available' });
  }
});

// Serve a simple HTML page to show the distance
app.get('/', (req, res) => {
    // Render the index.hbs template with the last distance

    res.render("index", {
        title: "Smart Waste Management System",
        distance: lastDistance || 'No data available',
    });
});

// Start the server
app.listen(port, (err) => {
  console.log(`Server running at http://localhost:${port}`);
});