<?php 
header("Content-Type: application/json");
include(__DIR__ . '/../../includes/conf.php');


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $full_name = $_POST['full_name'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $password_confirm = $_POST['password_confirm'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $dob = $_POST['dob'] ?? '';

    // Validate password match
    if ($password !== $password_confirm) {
        echo json_encode([
            "status" => "error",
            "message" => "Passwords do not match"
        ]);
        exit;
    }

    // Check if email exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode([
            "status" => "error",
            "message" => "Email already registered"
        ]);
        $stmt->close();
        exit;
    }
    $stmt->close();

    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Generate verification code
    $verify_code = rand(100000, 999999);

    // Insert user
    $stmt = $conn->prepare("INSERT INTO users (full_name, email, password, phone, dob, verify_code) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $full_name, $email, $hashed_password, $phone, $dob, $verify_code);
    $stmt->execute();
    $stmt->close();

    // Send email
    require __DIR__ . '/../../includes/send_mail.php';
    $sent = send_verification_email($email, $full_name, $verify_code, 'register');

    if ($sent) {
        $_SESSION['email_to_verify'] = $email;

        echo json_encode([
            "status" => "success",
            "message" => "Verification code sent successfully! Check your email."
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Failed to send verification code. Please try again."
        ]);
    }
}
?>
