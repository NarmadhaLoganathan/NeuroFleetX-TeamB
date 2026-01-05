const fs = require('fs');
try {
    // Try utf8 first as curl might output differently this time
    const content = fs.readFileSync('d:\\full\\models_new.json', 'utf8');
    const json = JSON.parse(content);
    console.log("Available Models:");
    json.models.forEach(m => console.log(m.name));
} catch (e) {
    console.error("Failed to read models:", e.message);
}
