// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to receive form data and write to JSON
app.post('/submit', (req, res) => {
  const newData = req.body;

  // Read the current data from 'data.json'
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error reading file' });
    }

    // Parse existing data or initialize an empty array
    const jsonData = data ? JSON.parse(data) : [];

    // Add new data to the array
    jsonData.push(newData);

    // Write updated data back to 'data.json'
    fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error writing to file' });
      }

      res.json({ message: 'Data saved successfully!' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
