const MP4_API = "https://youtube.anshppt19.workers.dev/anshapi?url=";

function send(res, code, data) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(code).end(JSON.stringify(data));
}

module.exports = async (req, res) => {
  try {
    const url = (req.query && req.query.url) ? String(req.query.url) : "";
    if (!url) return send(res, 400, { error: "Missing 'url' query parameter" });

    if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url)) {
      return send(res, 400, { error: "Please provide a valid YouTube URL" });
    }

    const r = await fetch(MP4_API + encodeURIComponent(url));
    const data = await r.json();

    let download = null;
    if (data.download) {
      download = data.download;
    } else if (data.url) {
      download = data.url;
    } else if (data.links && data.links[0]) {
      download = data.links[0].url;
    }

    if (!download) {
      return send(res, 404, { error: "Download link not found", response: data });
    }

    return send(res, 200, { download });
  } catch (err) {
    return send(res, 500, { error: err.message });
  }
};
