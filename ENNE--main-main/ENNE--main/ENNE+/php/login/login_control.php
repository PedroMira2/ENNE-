<?php
declare(strict_types=1);


function is_input_empty(string $email, string $username, string $password): bool {
    return empty($email) || empty($username) || empty($password);
}

// Check if the user exists in the database
function is_username_wrong(bool|array $result): bool {
    return !$result;  
}


function is_password_wrong(string $password, string $hashedpassword): bool {
    return !password_verify($password, $hashedpassword);  
}
