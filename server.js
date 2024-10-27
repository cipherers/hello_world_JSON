// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to receive journal entries
app.post('/journal', (req, res) => {
  const entry = req.body;

  // Read existing data from 'journal.json'
  fs.readFile('journal.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error reading journal file' });
    }

    // Parse existing data or create a new array
    const journalEntries = data ? JSON.parse(data) : [];

    // Add new entry
    journalEntries.push(entry);

    // Write updated data back to 'journal.json'
    fs.writeFile('journal.json', JSON.stringify(journalEntries, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error writing to journal file' });
      }

      res.json({ message: 'Journal entry saved successfully!' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
