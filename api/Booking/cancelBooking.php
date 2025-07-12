<?php 
header("Content-Type: application/json");

include(__DIR__ . '/../../includes/conf.php');
include(__DIR__ . '/../../includes/CsrfHelper.php'); //Includes the CSRF helper to validate the CSRF token.
include(__DIR__ . '/../../includes/NotificationHelper.php'); //Includes the Notification helper to send notifications to the user.
CsrfHelper::validateToken(); //Validates the CSRF token to prevent CSRF attacks. (Cross-Site Request Forgery)

if($_SERVER['REQUEST_METHOD'] === 'POST')
    {
        $client_id = $_POST['user_id'] ?? $_SESSION['user_id'] ?? null;
        $role = $_POST['role'] ?? $_SESSION['role'] ?? null;

    if(!$client_id || $role !== 'client') {  //Checking if the user is logged in and has the role of client.
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        exit;
    }
        $appointment_id = $_POST['appointment_id'];
        if(!$appointment_id)
        {
            echo json_encode(["status" => "error", "message" => "Missing appointment ID"]);
            exit;
        }

         $stmt = $conn->prepare("SELECT * FROM appointments WHERE id = ? AND client_id = ?");
        $stmt->bind_param("ii", $appointment_id, $client_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows === 0){
            echo json_encode(["status" => "error", "message" => "Appointment not found"]);
            exit;
        }


        $stmt = $conn->prepare("
        SELECT s.name AS service_name, u.full_name, a.date, a.time
        FROM appointments a
        JOIN services s ON a.service_id = s.id
        JOIN users u ON a.client_id = u.id
        WHERE a.id = ?
        ");
       $stmt->bind_param('i', $appointment_id);
       $stmt->execute();
       $stmt->bind_result($service_name, $client_name, $date, $time);
       $stmt->fetch();
       $stmt->close();

       // Check if the appointment is in the past
$appointmentDateTime = DateTime::createFromFormat('Y-m-d H:i', "$date $time");
$now = new DateTime();

if (!$appointmentDateTime) {
    echo json_encode(["status" => "error", "message" => "Invalid appointment date or time"]);
    exit;
}

if ($appointmentDateTime < $now) {
    echo json_encode(["status" => "error", "message" => "Cannot cancel past appointments"]);
    exit;
}


       $bookingData = [
            'service_name' => $service_name,
            'date' => $date,
            'time' => $time,
            'status' => 'cancelled'
        ];

        $stmt = $conn->prepare("SELECT status FROM appointments WHERE id = ? AND client_id = ?");
        $stmt->bind_param("ii", $appointment_id, $client_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        if ($row['status'] === 'completed' || $row['status'] === 'cancelled') {
            echo json_encode(["status" => "error", "message" => "Cannot cancel this appointment"]);
            exit;
        }



        $client_id = $_SESSION['user_id'];

        $stmt = $conn->prepare("UPDATE appointments SET status = 'cancelled' WHERE id = ? AND client_id = ?
");
        $stmt->bind_param("ii", $appointment_id, $client_id);
        if(!$stmt->execute())
        {
            echo json_encode(["status" => "error", "message" => "Deleting record error"]);
            exit;
        }
        if($stmt->affected_rows === 0)
        {
            echo json_encode(["status" => "error", "message" => "Appointment not found or already completed"]);
            exit;
        }
         NotificationHelper::sendBookingNotification($client_id, $bookingData);
        NotificationHelper::notifyAdmins("تم إلغاء الحجز", "قام العميل $client_name بإلغاء موعده لخدمة $service_name بتاريخ $date في تمام الساعة $time.");
        echo json_encode(["status" => "success", "message" => "Appointment cancelled successfully!"]);
        $stmt->close();

       
    }
else
    {
        echo json_encode(["status" => "error", "message" => "Appointment cancellation failure"]);
    }

    $conn->close();
?>