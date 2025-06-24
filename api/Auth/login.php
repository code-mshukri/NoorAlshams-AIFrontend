<?php 
// Sets the header to return JSON, useful for Postman or JS apps
header("Content-Type: application/json");
//Starts a session, which lets us store data..
session_start();   
include(__DIR__ . '/../../includes/conf.php');
include(__DIR__ . '/../../includes/CsrfHelper.php');

$email = $_POST['email'];
$password = $_POST['password'];

$sql = "SELECT full_name, id, is_active, is_verified, password, role FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s",$email);
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows === 1){
    $user = $result->fetch_assoc();

    if($user['is_verified'] !== 1){
        echo json_encode(["status" => "error", "message" => "Account not verified" ]);
        exit;
    }

    if(password_verify($password, $user['password']) || $password === $user['password'])  //Checks if the password is correct, or if the password is not hashed
    {
        if ($user['is_active'] == 0) {
        echo json_encode([
            "status" => "error",
            "message" => "Account is deactivated. Please contact admin."
        ]);
        exit;
    }
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role'];

        $log_sql = "INSERT INTO user_activity_log (user_id, action) VALUES (?, 'Logged in')";
        $log_stmt = $conn->prepare($log_sql);
        $log_stmt->bind_param("i", $user['id']);
        $log_stmt->execute();
        $log_stmt->close();
        $stmt->close();
        $csrf_token = CsrfHelper::generateToken();

        $conn->close();

        echo json_encode(
            ["status" => "success",
             "message" => "Login Successful",
              "full_name" => $user['full_name'],
               "role" => $user['role'],
                "csrf_token" => $csrf_token
        ]
    );
    }
    else{
        echo json_encode(["status" => "error", "message" => "Incorrect password"]);
        exit;
    }
}
else{
    echo json_encode(["status" => "error", "message" => "Email not found"]);
    exit;
}
?>

