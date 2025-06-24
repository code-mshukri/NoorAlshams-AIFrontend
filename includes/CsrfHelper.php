<?php
// includes/CsrfHelper.php

class CsrfHelper
{
    public static function generateToken()
    {
        // If token is not already generated for this session, create it
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32)); // 64 char token
        }

        return $_SESSION['csrf_token'];
    }

    public static function validateToken()
    {
        $tokenFromPost = $_POST['csrf_token'] ?? '';

        if (!isset($_SESSION['csrf_token']) || $tokenFromPost !== $_SESSION['csrf_token']) {
            echo json_encode([
                "status" => "error",
                "message" => "Invalid CSRF token."
            ]);
            exit;
        }
    }
}
?>
