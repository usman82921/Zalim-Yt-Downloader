<?php
header('Content-Type: application/json');

$url = $_GET['url'] ?? '';
$format = $_GET['format'] ?? 'mp3';

if (!$url) {
    echo json_encode(['success' => false, 'error' => 'Missing URL']);
    exit;
}

$apiUrl = $format === 'mp3'
    ? "https://youtube.anshppt19.workers.dev/anshapi?url=$url&format=mp3"
    : "https://youtube.anshppt19.workers.dev/anshapi?url=$url&format=mp4hd";

$response = file_get_contents($apiUrl);

if ($response) {
    echo $response;
} else {
    echo json_encode(['success' => false, 'error' => 'API request failed']);
}
