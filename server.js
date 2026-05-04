// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const csvPath = path.join(__dirname, "events.csv");

// Hvis CSV ikke findes, opret den med header
if (!fs.existsSync(csvPath)) {
    const header = "id,title,location,date,time,joined,max\n";
    fs.writeFileSync(csvPath, header, "utf8");
}

// ---------------- ADD EVENT TO CSV ----------------
app.post("/api/events", (req, res) => {
    const event = req.body;

    const safe = (value) => String(value).replace(/,/g, " ");

    const line = [
        safe(event.id),
        safe(event.title),
        safe(event.location),
        safe(event.date),
        safe(event.time),
        safe(event.joined),
        safe(event.max)
    ].join(",") + "\n";

    fs.appendFile(csvPath, line, (err) => {
        if (err) return res.status(500).json({ success: false });
        return res.json({ success: true });
    });
});

// ---------------- DELETE EVENT FROM CSV ----------------
app.post("/api/delete-event", (req, res) => {
    const eventId = String(req.body.id);

    fs.readFile(csvPath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ success: false });

        const lines = data.split("\n");

        // Behold header + alle linjer hvor ID ikke matcher
        const filtered = lines.filter(line => !line.startsWith(eventId + ","));

        fs.writeFile(csvPath, filtered.join("\n"), (err) => {
            if (err) return res.status(500).json({ success: false });
            return res.json({ success: true });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
