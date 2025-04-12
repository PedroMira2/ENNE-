<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST["Email"];
    $username = $_POST["username"];
    $password = $_POST["password"];
    $loggedin = false;

    try {
        require_once __DIR__ . "/../connect.php";
        require_once "login_modal.php";
        require_once "login_control.php";

        $errors = [];

        if (is_input_empty($email, $username, $password)) {
            $errors["Empty_input"] = "Fill in all fields";
        }

        $result = get_user($pdo, $username);

        if (is_username_wrong($result)) {
            $errors["login_incorrect"] = "Incorrect login info";
        }

        require_once __DIR__ . "/../config_session.php";

        if ($errors) {
            // Redirect to Home.html with the error code
            header("Location: ../../Home.html?login=error");
            exit();
        }

        $_SESSION["user_id"] = $result["id"];
        $_SESSION["user_username"] = $result["username"];
        $_SESSION["last_regeneration"] = time();

        $pdo = null;
        $statment = null;
        $loggedin = true;

        if ($loggedin) {
            // Redirect to Home.html with success message
            header("Location: ../../Home.html?login=success");
            exit();
        } else {
            header("Location: ../../Home.html?login=error");
        }

    } catch (PDOException $e) {
        die("Query failed: " . $e->getMessage());
    }

} else {
    header("Location: ../../Home.html");
    exit();
}
