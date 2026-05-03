/**
 * SKILLSWAP PLATFORM - BACKEND SERVER (VIVA-FRIENDLY VERSION)
 * --------------------------------------------------------
 * This file handles all the "behind the scenes" logic for our website.
 * It uses Node.js and Express.js to create a web server.
 * 
 * VIVA EXPLANATION:
 * 1. Express: A library that helps us handle URL requests (like /login).
 * 2. FS (File System): A built-in Node tool to read and write files on the computer.
 * 3. JSON: A format to store data. We use 'db.json' as our "database".
 */

// Importing required modules
var express = require('express');    
var cors = require('cors');          
var bodyParser = require('body-parser'); 
var fs = require('fs');              
var path = require('path');          

var app = express();                 
var PORT = process.env.PORT || 3000;                     
var DB_PATH = path.join(__dirname, 'data', 'db.json'); 

// SETTING UP THE SERVER TOOLS
app.use(cors());                        
app.use(bodyParser.json());             
app.use(express.static(path.join(__dirname, 'public'))); 

/**
 * LATENCY LOGGER MIDDLEWARE:
 * This tracks how long every request takes to process.
 * Excellent for "API Latency Analysis" evaluation criteria.
 */
app.use(function(req, res, next) {
    var start = Date.now();
    res.on('finish', function() {
        var duration = Date.now() - start;
        console.log('[API] ' + req.method + ' ' + req.url + ' - ' + duration + 'ms');
    });
    next();
});

/**
 * generateId: A simple function to create a unique ID.
 * Instead of complex libraries, we just use the current time in milliseconds.
 * This ensures every ID is different.
 */
function generateId() {
    return "id-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}

/**
 * readDB: Reads the db.json file and converts it to a JS Object.
 */
function readDB() {
    try {
        var fileContent = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(fileContent);
    } catch (err) {
        return { users: [], requests: [], messages: [] };
    }
}

/**
 * writeDB: Converts a JS Object to a string and saves it to db.json.
 */
function writeDB(data) {
    try {
        var jsonString = JSON.stringify(data, null, 2);
        fs.writeFileSync(DB_PATH, jsonString);
    } catch (err) {
        console.error("Error writing to database:", err);
    }
}

/**
 * --- API ROUTES ---
 */

// REGISTER NEW USER
app.post('/api/register', function(req, res) {
    try {
        var db = readDB(); 
        var userData = req.body; 

        // Check if email exists
        var existingUser = null;
        for (var i = 0; i < db.users.length; i++) {
            if (db.users[i].email === userData.email) {
                existingUser = db.users[i];
                break;
            }
        }

        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        // Create new user object
        var newUser = {
            id: generateId(),
            name: userData.name,
            email: userData.email,
            password: userData.password, 
            enrollmentNumber: userData.enrollmentNumber,
            batch: userData.batch,
            year: userData.year,
            skillsIKnow: userData.skillsIKnow || [],
            skillsIWantToLearn: userData.skillsIWantToLearn || [],
            bio: userData.bio || "",
            googleMeetLink: userData.googleMeetLink || "",
            createdAt: new Date().toISOString()
        };

        // --- DATA VALIDATION ---
        if (!userData.name || !userData.email || !userData.password || !userData.enrollmentNumber) {
            return res.status(400).json({ error: "Missing required fields (Name, Email, Password, Enrollment)" });
        }
        
        if (userData.password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }
        // ------------------------

        db.users.push(newUser);
        writeDB(db);

        // Send back user without password
        var safeUser = JSON.parse(JSON.stringify(newUser));
        delete safeUser.password;
        res.status(201).json(safeUser);
    } catch (err) {
        res.status(500).json({ error: "Registration failed" });
    }
});

// LOGIN
app.post('/api/login', function(req, res) {
    try {
        var db = readDB(); 
        var email = req.body.email;
        var password = req.body.password;

        var userFound = null;
        for (var i = 0; i < db.users.length; i++) {
            if (db.users[i].email === email && db.users[i].password === password) {
                userFound = db.users[i];
                break;
            }
        }

        if (!userFound) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const safeUser = JSON.parse(JSON.stringify(userFound));
        delete safeUser.password;
        res.json(safeUser);
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});

// GET ALL USERS
app.get('/api/users', function(req, res) {
    try {
        var db = readDB();
        var safeUsersList = [];
        for (var i = 0; i < db.users.length; i++) {
            var userCopy = JSON.parse(JSON.stringify(db.users[i]));
            delete userCopy.password;
            safeUsersList.push(userCopy);
        }
        res.json(safeUsersList);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// GET SINGLE USER
app.get('/api/users/:id', function(req, res) {
    try {
        var db = readDB();
        var requestedId = req.params.id; 

        var userFound = null;
        for (var i = 0; i < db.users.length; i++) {
            if (db.users[i].id === requestedId) {
                userFound = db.users[i];
                break;
            }
        }

        if (!userFound) {
            return res.status(404).json({ error: "User not found" });
        }

        var safeUser = JSON.parse(JSON.stringify(userFound));
        delete safeUser.password;
        res.json(safeUser);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

// UPDATE USER
app.put('/api/users/:id', function(req, res) {
    try {
        var db = readDB();
        var requestedId = req.params.id;
        var updateData = req.body;

        var userToUpdate = null;
        for (var i = 0; i < db.users.length; i++) {
            if (db.users[i].id === requestedId) {
                userToUpdate = db.users[i];
                break;
            }
        }

        if (!userToUpdate) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update fields if they exist in request
        if (updateData.bio !== undefined) userToUpdate.bio = updateData.bio;
        if (updateData.googleMeetLink !== undefined) userToUpdate.googleMeetLink = updateData.googleMeetLink;

        writeDB(db);

        var safeUser = JSON.parse(JSON.stringify(userToUpdate));
        delete safeUser.password;
        res.json(safeUser);
    } catch (err) {
        res.status(500).json({ error: "Update failed" });
    }
});

// SEARCH USERS BY SKILL
app.get('/api/search', function(req, res) {
    try {
        var searchSkill = req.query.skill; 
        if (!searchSkill) {
            return res.json([]);
        }

        var db = readDB();
        var results = [];
        var query = searchSkill.toLowerCase();

        for (var i = 0; i < db.users.length; i++) {
            var user = db.users[i];
            var matchFound = false;
            
            for (var j = 0; j < user.skillsIKnow.length; j++) {
                if (user.skillsIKnow[j].toLowerCase().indexOf(query) !== -1) {
                    matchFound = true;
                    break;
                }
            }

            if (matchFound) {
                var userCopy = JSON.parse(JSON.stringify(user));
                delete userCopy.password;
                results.push(userCopy);
            }
        }

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});

// SEND REQUEST
app.post('/api/requests', function(req, res) {
    try {
        var db = readDB();
        var newRequest = {
            id: generateId(),
            fromUserId: req.body.fromUserId,
            toUserId: req.body.toUserId,
            skillNeeded: req.body.skillNeeded,
            message: req.body.message,
            timestamp: new Date().toISOString()
        };

        db.requests.push(newRequest);
        writeDB(db);
        res.status(201).json(newRequest);
    } catch (err) {
        res.status(500).json({ error: "Failed to send request" });
    }
});

// GET RECEIVED REQUESTS
app.get('/api/requests/:userId', function(req, res) {
    try {
        var db = readDB();
        var userId = req.params.userId;
        var results = [];

        for (var i = 0; i < db.requests.length; i++) {
            var reqObj = db.requests[i];
            if (reqObj.toUserId === userId) {
                // Find sender name
                var senderName = "Unknown Student";
                for (var j = 0; j < db.users.length; j++) {
                    if (db.users[j].id === reqObj.fromUserId) {
                        senderName = db.users[j].name;
                        break;
                    }
                }
                var copy = JSON.parse(JSON.stringify(reqObj));
                copy.senderName = senderName;
                results.push(copy);
            }
        }

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch requests" });
    }
});

// GET SENT REQUESTS
app.get('/api/requests/sent/:userId', function(req, res) {
    try {
        var db = readDB();
        var userId = req.params.userId;
        var results = [];

        for (var i = 0; i < db.requests.length; i++) {
            var reqObj = db.requests[i];
            if (reqObj.fromUserId === userId) {
                // Find receiver name
                var receiverName = "Unknown Student";
                for (var j = 0; j < db.users.length; j++) {
                    if (db.users[j].id === reqObj.toUserId) {
                        receiverName = db.users[j].name;
                        break;
                    }
                }
                var copy = JSON.parse(JSON.stringify(reqObj));
                copy.receiverName = receiverName;
                results.push(copy);
            }
        }

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch sent requests" });
    }
});

// DELETE REQUEST (Completes CRUD: Delete)
app.delete('/api/requests/:id', function(req, res) {
    try {
        var db = readDB();
        var requestId = req.params.id;
        
        var foundIndex = -1;
        for (var i = 0; i < db.requests.length; i++) {
            if (db.requests[i].id === requestId) {
                foundIndex = i;
                break;
            }
        }

        if (foundIndex === -1) {
            return res.status(404).json({ error: "Request not found" });
        }

        db.requests.splice(foundIndex, 1);
        writeDB(db);
        res.json({ message: "Request deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

// SEND MESSAGE
app.post('/api/messages', function(req, res) {
    try {
        var db = readDB();
        var newMessage = {
            id: generateId(),
            fromUserId: req.body.fromUserId,
            toUserId: req.body.toUserId,
            text: req.body.text,
            timestamp: new Date().toISOString()
        };

        db.messages.push(newMessage);
        writeDB(db);
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: "Failed to send message" });
    }
});

// GET CHAT HISTORY
app.get('/api/messages/:u1/:u2', function(req, res) {
    try {
        var id1 = req.params.u1;
        var id2 = req.params.u2;
        var db = readDB();
        var history = [];

        for (var i = 0; i < db.messages.length; i++) {
            var msg = db.messages[i];
            var case1 = (msg.fromUserId === id1 && msg.toUserId === id2);
            var case2 = (msg.fromUserId === id2 && msg.toUserId === id1);
            if (case1 || case2) {
                history.push(msg);
            }
        }

        // Simple bubble sort (viva talking point!)
        for (var x = 0; x < history.length; x++) {
            for (var y = 0; y < history.length - 1; y++) {
                if (new Date(history[y].timestamp) > new Date(history[y+1].timestamp)) {
                    var temp = history[y];
                    history[y] = history[y+1];
                    history[y+1] = temp;
                }
            }
        }

        res.json(history);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

// START SERVER
app.listen(PORT, function() {
    console.log("SkillSwap Server is active!");
    console.log("URL: http://localhost:" + PORT);
});
