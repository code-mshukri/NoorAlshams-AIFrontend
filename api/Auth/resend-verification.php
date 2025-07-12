<?php

header("Content-Type: application/json");
session_start();

include(__DIR__ . '/../../includes/conf.php');
require __DIR__ . '/../../includes/send_mail.php';

$email = $_POST['email'] ?? null;

if (!$email) {
    echo json_encode([
        "status" => "error",
        "message" => "Email is required."
    ]);
    exit;
}

// Check if user exists
$sql = "SELECT full_name FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->bind_result($full_name);
if (!$stmt->fetch()) {
    echo json_encode([
        "status" => "error",
        "message" => "No user found with this email."
    ]);
    $stmt->close();
    exit;
}
$stmt->close();

// Generate new verification code
$verify_code = rand(100000, 999999);

// Update code in database
$sql = "UPDATE users SET verify_code = ? WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $verify_code, $email);
$stmt->execute();
$stmt->close();

// Send email
$sent = send_verification_email($email, $full_name, $verify_code, 'register');
if ($sent) {
    echo json_encode([
        "status" => "success",
        "message" => "Verification code resent successfully!"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to send verification code."
    ]);
}
?>