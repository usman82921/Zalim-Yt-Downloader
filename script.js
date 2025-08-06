function download(format) {
  const url = document.getElementById("urlInput").value;
  if (!url) {
    alert("Please enter a YouTube URL");
    return;
  }

  document.getElementById("status").innerText = "⏳ Please wait...";

  fetch(`api/download.php?url=${encodeURIComponent(url)}&format=${format}`)
    .then(res => res.json())
    .then(data => {
      if (data.success && data.data) {
        const downloadUrl = format === "mp3" ? data.data.url_mp3_youtube : data.data.url_mp4_youtube;
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = format === "mp3" ? data.data.name_mp3 : data.data.name_mp4;
        a.click();
        document.getElementById("status").innerText = "✅ Download ready!";
      } else {
        document.getElementById("status").innerText = "❌ Failed to fetch download.";
      }
    })
    .catch(() => {
      document.getElementById("status").innerText = "❌ Error occurred while fetching.";
    });
}
