<?php 

class NotificationHelper {

    public static function sendNotification($user_id, $title, $message){
        global $conn;

        $stmt = $conn->prepare("INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $user_id, $title, $message);

        if (!$stmt->execute()) {
            echo json_encode([
                "status" => "error",
                "message" => "فشل في إرسال الإشعار: " . $stmt->error
            ]);
            return false;
        }

        $stmt->close();

        $stmt = $conn->prepare("
            DELETE FROM notifications 
            WHERE user_id = ? 
            AND id NOT IN (
                SELECT id FROM (
                    SELECT id FROM notifications 
                    WHERE user_id = ? 
                    ORDER BY created_at DESC 
                    LIMIT 100
                ) AS keep_ids
            )
        ");
        $stmt->bind_param('ii', $user_id, $user_id);
        $stmt->execute();
        $stmt->close();
    }

    public static function sendBookingNotification($user_id, $bookingData){
        switch($bookingData['status']) {
            case 'confirmed':
                $title = "تم تأكيد الحجز";
                $message = "تم تأكيد حجزك لـ " . $bookingData['service_name'] . " بتاريخ " . $bookingData['date'] . " الساعة " . $bookingData['time'] . ".";
                break;
            case 'cancelled':
                $title = "تم إلغاء الحجز";
                $message = "تم إلغاء حجزك لـ " . $bookingData['service_name'] . " بتاريخ " . $bookingData['date'] . " الساعة " . $bookingData['time'] . ".";
                break;
            case 'pending':
                $title = "الحجز قيد المراجعة";
                $message = "حجزك لـ " . $bookingData['service_name'] . " بتاريخ " . $bookingData['date'] . " الساعة " . $bookingData['time'] . " قيد المراجعة.";
                break;
            case 'updated':
                $title = "تم تعديل الحجز";
                $message = "تم تعديل حجزك لـ " . $bookingData['service_name'] . " من التاريخ " . $bookingData['old_date'] . " الساعة " . $bookingData['old_time'] . " إلى " . $bookingData['new_date'] . " الساعة " . $bookingData['new_time'] . ".";
                break;
            case 'completed':
                $title = "تم الانتهاء من الحجز";
                $message = "تم الانتهاء من حجزك لـ " . $bookingData['service_name'] . " بتاريخ " . $bookingData['date'] . " الساعة " . $bookingData['time'] . ".";
                break;
            default:
                return false;
        }

        self::sendNotification($user_id, $title, $message);
    } 

    public static function sendStaffAssignmentNotification($staff_id, $data) {
        $message = "تم تعيينك لموعد في تاريخ {$data['date']} الساعة {$data['time']}.";
        self::sendNotification($staff_id, "تم تعيين موعد جديد", $message);
    }

    public static function sendAnnouncementNotification($user_id, $announcementData){
        $title = "إعلان جديد";
        $message = "إعلان جديد: " . $announcementData['message'];
        self::sendNotification($user_id, $title, $message);
    }

    public static function sendFeedbackNotification($user_id, $feedbackData){
        $title = "تم استلام تقييم جديد";
        $message = "تقييم جديد من " . $feedbackData['user_name'] . ": " . $feedbackData['comment'];
        self::sendNotification($user_id, $title, $message);
    }

    public static function sendCheckInNotification($staff_id, $checkInData){
        $title = "إشعار تسجيل دخول";
        $message = "قام الموظف " . $checkInData['staff_name'] . " بتسجيل الدخول بتاريخ " . $checkInData['date']. " الساعة " . $checkInData['time'] . ".";
        self::sendNotification($staff_id, $title, $message);
    }

    public static function sendCheckOutNotification($staff_id, $checkOutData){
        $title = "إشعار تسجيل خروج";
        $message = "قام الموظف " . $checkOutData['staff_name'] . " بتسجيل الخروج بتاريخ " . $checkOutData['date']. " الساعة " . $checkOutData['time'] . ".";
        self::sendNotification($staff_id, $title, $message);
    }

    public static function sendMessageNotification($user_id, $messageData){
        $title = "رسالة جديدة";
        $message = "وصلك رسالة جديدة من " . $messageData['sender_name'] . ": " . $messageData['content'];
        self::sendNotification($user_id, $title, $message);
    }

    public static function notifyAdmins($title, $message) {
        global $conn;

        $stmt = $conn->prepare("SELECT id FROM users WHERE role = 'admin' AND is_active = 1");
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            $admin_id = $row['id'];
            self::sendNotification($admin_id, $title, $message);
        }

        $stmt->close();
    }

}

?>
