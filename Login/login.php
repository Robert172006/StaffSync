<?php
session_start();
require "db.php";
header("Content-Type: application/json");

$data     = json_decode(file_get_contents("php://input"), true) ?? [];
$login    = trim($data["user"] ?? "");
$password = $data["password"] ?? "";

$stmt = $pdo->prepare("SELECT email, username, password FROM signup WHERE username = ? OR email = ?");
$stmt->execute([$login, $login]);
$row = $stmt->fetch();

if (!$row || !password_verify($password, $row["password"])) {
    http_response_code(401);
    echo json_encode(["ok" => false, "message" => "Invalid username or password."]);
    exit;
}

session_regenerate_id(true);
$_SESSION["email"]    = $row["email"];
$_SESSION["username"] = $row["username"];

echo json_encode(["ok" => true, "message" => "Welcome back, " . $row["username"] . "!"]);