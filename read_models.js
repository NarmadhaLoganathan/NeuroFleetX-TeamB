const fs = require('fs');
try {
    const content = fs.readFileSync('d:\\full\\models.json', 'ucs2'); // UCS-2 is roughly UTF-16LE
    const json = JSON.parse(content);
    console.log("Available Models:");
    json.models.forEach(m => console.log(m.name));
} catch (e) {
    try {
        // Fallback to utf8 if ucs2 fails or looks weird
        const content = fs.readFileSync('d:\\full\\models.json', 'utf8');
        const json = JSON.parse(content);
        console.log("Available Models (UTF8):");
        json.models.forEach(m => console.log(m.name));
    } catch (e2) {
        console.error("Failed to read models:", e2.message);
    }
}
