// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Add this to the top of server.js
const users = [
    { username: 'admin', password: 'adminpass', role: 'admin' },
    { username: 'editor', password: 'editorpass', role: 'editor' },
    { username: 'player', password: 'playerpass', role: 'player' },
    { username: 'dungeonmaster', password: 'dmpass', role: 'dungeonmaster' },
  ];
  
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

app.get('/export', (req, res) => {
    const { username } = req.query;
  
    // Check if the user has an active session and role
    const role = sessions[username];
    if (!role || !['player', 'dungeonmaster'].includes(role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
  
    // Read the journal data
    fs.readFile('journal.json', 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ message: 'Error reading journal file' });
      }
  
      // Send JSON data for download
      res.setHeader('Content-Disposition', 'attachment; filename="journal.json"');
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
    });
  });
  

// Session handling for simplicity
const sessions = {};

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Save session and return user role
  sessions[username] = user.role;
  res.json({ role: user.role });
});

app.post('/logout', (req, res) => {
    const { username } = req.body;
    delete sessions[username];
    res.json({ message: 'Logged out' });
  });
  

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
