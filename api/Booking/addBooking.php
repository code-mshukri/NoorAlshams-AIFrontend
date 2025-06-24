<?php 
session_start();
include(__DIR__ . '/../../includes/conf.php');
include(__DIR__ . '/../../includes/CsrfHelper.php');
include(__DIR__ . '/../../includes/NotificationHelper.php');
header("Content-Type: application/json");
CsrfHelper::validateToken();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $client_id = $_POST['user_id'] ?? $_SESSION['user_id'] ?? null;
    $role = $_POST['role'] ?? $_SESSION['role'] ?? null;

    if (!$client_id || $role !== 'client') {
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        exit;
    }

    $service_id = $_POST['service_id'] ?? null;
    $date = $_POST['date'] ?? null;
    $time = $_POST['time'] ?? null;

    if (!$service_id || !$date || !$time) {
        echo json_encode(["status" => "error", "message" => "Missing required booking fields"]);
        exit;
    }

    $date_today = date('Y-m-d');
    if ($date < $date_today) {
        echo json_encode(["status" => "error", "message" => "This date has passed"]);
        exit;
    }

    // ✅ Check if time is already booked for this service
    $stmt = $conn->prepare("SELECT id FROM appointments WHERE service_id = ? AND date = ? AND time = ?");
    $stmt->bind_param("iss", $service_id, $date, $time);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "This time slot is already booked for this service."]);
        exit;
    }
    $stmt->close();

    // ✅ Get service price and name
    $stmt = $conn->prepare("SELECT price, name FROM services WHERE id = ?");
    $stmt->bind_param("i", $service_id);
    if (!$stmt->execute()) {
        echo json_encode(["status" => "error", "message" => "SQL error while retrieving service info"]);
        exit;
    }
    $result = $stmt->get_result();
    $service = $result->fetch_assoc();
    $appointment_price = $service['price'];
    $service_name = $service['name'];
    $stmt->close();

    // ✅ Get client name
    $stmt = $conn->prepare("SELECT full_name FROM users WHERE id = ?");
    $stmt->bind_param("i", $client_id);
    if (!$stmt->execute()) {
        echo json_encode(["status" => "error", "message" => "SQL error while retrieving client info"]);
        exit;
    }
    $result = $stmt->get_result();
    $client = $result->fetch_assoc();
    if (!$client) {
        echo json_encode(["status" => "error", "message" => "Client not found"]);
        exit;
    }
    $client_name = $client['full_name'];
    $stmt->close();

    // ✅ Insert appointment with NULL staff_id
    $stmt = $conn->prepare("INSERT INTO appointments (client_id, service_id, date, time, price) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("iissi", $client_id, $service_id, $date, $time, $appointment_price);
    if (!$stmt->execute()) {
        echo json_encode(["status" => "error", "message" => "DB error: Booking failed"]);
        exit;
    }

    $appointment_id = $stmt->insert_id;
    $stmt->close();

    // ✅ Send booking notification
    $bookingData = [
        'client_name' => $client_name,
        'client_id' => $client_id,
        'service_name' => $service_name,
        'date' => $date,
        'time' => $time,
        'price' => $appointment_price,
        'status' => 'pending'
    ];
    NotificationHelper::sendBookingNotification($client_id, $bookingData);
    NotificationHelper::notifyAdmins("New Booking Request", "A new booking has been made by $client_name for $service_name on $date at $time. Please review and confirm.");

    echo json_encode(["status" => "success", "message" => "Appointment booked successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
}

$conn->close();
