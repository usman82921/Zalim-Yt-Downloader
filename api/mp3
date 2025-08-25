// api/mp3.js - Vercel Serverless Function (Node.js 18+)
const MP3_API = "https://ytdownloader.anshppt19.workers.dev/?url=";

// Helper to send JSON with CORS
function send(res, code, data) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(code).end(JSON.stringify(data));
}

module.exports = async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      return res.status(204).end();
    }

    const url = (req.query && req.query.url) ? String(req.query.url) : "";
    if (!url) return send(res, 400, { error: "Missing 'url' query parameter" });

    // Basic validation
    if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url)) {
      return send(res, 400, { error: "Please provide a valid YouTube URL" });
    }

    const apiUrl = MP3_API + encodeURIComponent(url);

    const r = await fetch(apiUrl, { method: "GET" });
    if (!r.ok) {
      const txt = await r.text();
      return send(res, 502, { error: `Upstream failed (${r.status})`, details: txt.slice(0, 500) });
    }
    const data = await r.json();
    return send(res, 200, data);
  } catch (err) {
    return send(res, 500, { error: "Server error", details: String(err && err.message || err) });
  }
};
