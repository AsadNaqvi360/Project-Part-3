// Import necessary modules
const express = require('express');
const path = require('path');

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define the main route for the landing page
app.get('/', (req, res) => {
    res.render('index', { title: 'Brown Man Inc.' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
