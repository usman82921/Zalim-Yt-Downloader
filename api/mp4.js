const MP4_API = "https://youtube.anshppt19.workers.dev/anshapi?url=";

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

    if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url)) {
      return send(res, 400, { error: "Please provide a valid YouTube URL" });
    }

    const apiUrl = MP4_API + encodeURIComponent(url);

    const r = await fetch(apiUrl, { method: "GET" });
    if (!r.ok) {
      const txt = await r.text();
      return send(res, 502, { error: `Upstream failed (${r.status})`, details: txt.slice(0, 500) });
    }
    
    const data = await r.json();
    
    // 720p ریزولوشن تلاش کریں
    let video720p = data.formats.find(format => format.resolution === '720p');
    if (!video720p) {
      return send(res, 404, { error: "720p resolution not available" });
    }

    // 720p ویڈیو کی معلومات واپس بھیجنا
    return send(res, 200, { videoUrl: video720p.url, resolution: "720p" });
  } catch (err) {
    return send(res, 500, { error: "Server error", details: String(err && err.message || err) });
  }
};
