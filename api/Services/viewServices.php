<?php
include(__DIR__ . '/../../includes/conf.php');  //Connects with the database
header("Content-Type: application/json");       //Prepares the POSTMAN to deal with JSON format not HTML

 $page_num = isset($_GET['page']) && is_numeric($_GET['page']) ? intval($_GET['page']) : 1;  //This is ternary operator, it's syntax is: condition ? value_if_true : value_if_false
    $limit = 10;
    $offset = ($page_num - 1) * $limit;

$sql = "SELECT * FROM services WHERE is_active = 1 LIMIT ? OFFSET ?";       //Selects id, name and description from the services table
$stmt = $conn->prepare($sql);            //Prepares the SQL statement
$stmt->bind_param("ii", $limit, $offset); //Binds the parameters to the SQL statement
$stmt->execute();                       //Executes the SQL statement
$result = $stmt->get_result();         //Returns mysqli object to variable $result

if($result->num_rows > 0)               //If there is at least one row
{
    $services = [];                     //Crete the array of services

    while($row = $result->fetch_assoc())            //In this loop we are fetching each row and store it into the services array by using this condition
    {
        $services[] = $row;
    }
    echo json_encode(["status" => "success", "services" => $services]);
}
else{
    echo json_encode(["status" => "error", "message" => "No services found"]);
}

$conn->close();
?>