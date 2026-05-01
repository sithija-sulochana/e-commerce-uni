<?php
header('Content-Type: application/json');
require '../db.php';

global $con;

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

if (!$con) {
    die(json_encode(['error' => 'Database connection failed']));
}

switch ($method) {
    case 'GET':
        // Fetch all FAQs grouped by category
        $query = "SELECT id, category, question, answer FROM faqs ORDER BY category, id ASC";
        $result = mysqli_query($con, $query);
        if ($result) {
            $faqs = mysqli_fetch_all($result, MYSQLI_ASSOC);
            // Group by category
            $grouped = [];
            foreach ($faqs as $faq) {
                $category = $faq['category'] ?: 'General';
                if (!isset($grouped[$category])) {
                    $grouped[$category] = [];
                }
                $grouped[$category][] = $faq;
            }
            echo json_encode($grouped ?: []);
        } else {
            echo json_encode(['error' => mysqli_error($con)]);
        }
        break;

    case 'POST':
        // Add FAQ
        $category = mysqli_real_escape_string($con, $data['category'] ?? 'General');
        $question = mysqli_real_escape_string($con, $data['question'] ?? '');
        $answer = mysqli_real_escape_string($con, $data['answer'] ?? '');
        $query = "INSERT INTO faqs (category, question, answer) VALUES ('$category', '$question', '$answer')";
        if (mysqli_query($con, $query)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => mysqli_error($con)]);
        }
        break;

    case 'PUT':
        // Update FAQ
        $id = intval($data['id'] ?? 0);
        $category = mysqli_real_escape_string($con, $data['category'] ?? 'General');
        $question = mysqli_real_escape_string($con, $data['question'] ?? '');
        $answer = mysqli_real_escape_string($con, $data['answer'] ?? '');
        $query = "UPDATE faqs SET category='$category', question='$question', answer='$answer' WHERE id=$id";
        if (mysqli_query($con, $query)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => mysqli_error($con)]);
        }
        break;

    case 'DELETE':
        // Delete FAQ
        $id = intval($data['id'] ?? 0);
        $query = "DELETE FROM faqs WHERE id=$id";
        if (mysqli_query($con, $query)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => mysqli_error($con)]);
        }
        break;

    default:
        echo json_encode(['error' => 'Invalid request method']);
}
?>
