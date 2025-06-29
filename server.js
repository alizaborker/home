const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const COMMENTS_FILE = path.join(__dirname, 'comments.json');

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

app.use(bodyParser.json());
//app.use(express.static('public'));

// Endpoint to get comments
app.get('/comments', (req, res) => {
    fs.readFile(COMMENTS_FILE, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading comments file');
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to post a new comment
app.post('/comments', (req, res) => {
    
    const newComment = req.body;
    console.log(`Server /comments received a post ${newComment}`);
    fs.readFile(COMMENTS_FILE, (err, data) => {
        if (err) {
            return res.status(500).send('{"response": "Error reading comments file}"}');
        }
        const comments = JSON.parse(data);
        comments.push(newComment);
        fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing to comments file');
                console.log(`Server /comments : Error writing to comments file`); 
            }
            res.status(201).send('{"response": "Comment added"}');
            console.log(`Server /comments : Comment added`); 
        });
    });
    
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
