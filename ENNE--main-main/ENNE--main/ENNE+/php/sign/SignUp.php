<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST["Name"];
    $email = $_POST["Email"];
    $username = $_POST["username"];
    $password = $_POST["password"];

    $profilePicturePath = null;

    if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['profile_picture']['tmp_name'];
        $fileName = $_FILES['profile_picture']['name'];
        $fileNameCmps = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameCmps));
        $newFileName = uniqid('img_', true) . '.' . $fileExtension;

        $uploadFileDir = './uploads/';
        $dest_path = $uploadFileDir . $newFileName;

        if (!is_dir($uploadFileDir)) {
            mkdir($uploadFileDir, 0755, true);
        }

        if (move_uploaded_file($fileTmpPath, $dest_path)) {
            $profilePicturePath = $dest_path;
        } else {
            die("Error uploading the profile picture.");
        }
    }

    try {
        require_once __DIR__ . "/../connect.php";

        require_once "SignInView.php";
        require_once "SignInModal.php";
        require_once "SignInControl.php";
        

        session_start();
        $errors = [];

        if (is_input_empty($email, $username, $password)) {
            $errors["Empty_input"] = "Fill in all fields";
        }

        if (is_email_invalid($email)) {
            $errors["Invalid_email"] = "Enter a valid email";
        }

        if (is_username_taken($pdo, $username)) {
            $errors["User_Taken"] = "Username is already taken";
        }

        if (is_email_registered($pdo, $email)) {
            $errors["Email_Used"] = "Email is already registered";
        }
        require_once __DIR__ . "/../config_session.php";

        if ($errors) {
            $_SESSION["Errors_signup"] = $errors;
            header("Location: ../../Home.html");
            exit();
        }

        create_user($pdo, $email, $username, $password,);

        header("Location: ../../Home.html?SignUp=success");

        exit();
    } catch (PDOException $e) {
        die("Query failed: " . $e->getMessage());
    }
} else {
    header("Location: ../Home.html");
    exit();
}
