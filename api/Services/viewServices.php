<?php
include(__DIR__ . '/../../includes/conf.php');
header("Content-Type: application/json");

try {
    $limit = 10;
    $offset = 0;
    $isPaginated = false;

    if (isset($_GET['page']) && is_numeric($_GET['page'])) {
        $isPaginated = true;
        $page_num = intval($_GET['page']);
        $offset = ($page_num - 1) * $limit;
    }

    if ($isPaginated) {
        $sql = "SELECT * FROM services WHERE is_active = 1 LIMIT ? OFFSET ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $limit, $offset);
    } else {
        $sql = "SELECT * FROM services WHERE is_active = 1";
        $stmt = $conn->prepare($sql);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $services = [];
    while ($row = $result->fetch_assoc()) {
        $services[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "data" => $services
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Something went wrong: " . $e->getMessage()
    ]);
}

$conn->close();
