const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// טוען בסיס נתונים
let db = JSON.parse(fs.readFileSync("database.json"));
let users = JSON.parse(fs.readFileSync("users.json"));

// פונקציה לשמירה
function save() {
    fs.writeFileSync("database.json", JSON.stringify(db, null, 2));
}

// התחברות
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) return res.json({ success: false });

    res.json({ success: true, user });
});

// הוספת ציון
app.post("/add-grade", (req, res) => {
    const { studentId, subject, grade } = req.body;

    if (!db.grades[studentId]) db.grades[studentId] = [];

    db.grades[studentId].push({
        subject,
        grade,
        date: new Date().toLocaleDateString()
    });

    save();
    res.json({ success: true });
});

// קבלת ציונים של תלמיד
app.get("/grades/:id", (req, res) => {
    const id = req.params.id;
    res.json(db.grades[id] || []);
});

app.listen(3000, () => console.log("Server running on port 3000"));
