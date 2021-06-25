// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
const express = require('express');
// The path module provides utilities for working with file and directory paths. It can be accessed using:
const path = require('path');
// fs is a Node standard library package for reading and writing files
const fs = require('fs');

// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server

// Tells node that we are creating an "express" server
const app = express();

// Sets an initial port. We"ll use this later in our listener
const PORT = process.env.PORT || 8080;
app.use(express.static('public'));
// Sets up the Express app to handle data parsing (will always look like this , 2 lines, under PORT)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var notes = require('./db/db.json');

// Route '/' return the index.html file (Get Start Page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});
// Route '/notes' return the notes.html file (Note Taker page-to write the note)
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});
//Route '/api/notes'read the db.json file and return all saved notes as JSON (show the saved note on left-hand column)
app.get('/api/notes', (req, res) => {
    res.json(notes);
});


app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = notes.length.toString(); 
  
    notes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(newNote);
  });

app.delete('/api/notes/:id', (req, res) =>{
    notes = notes.filter( note => {
        return note.id !== req.params.id;
    });
        fs.writeFileSync('./db/db.json', JSON.stringify(notes));
        res.json(notes); 
    
});

// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs.

// require('./routes/apiRoutes')(app);
// require('./routes/htmlRoutes')(app);

// LISTENER
// The below code effectively "starts" our server
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
