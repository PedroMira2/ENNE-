<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $name = $_POST["name"];
    $business = $_POST["business"];
    $email = $_POST["email"];
    $password = password_hash($_POST["Password"], PASSWORD_DEFAULT);
    $phone = $_POST["phone"];
    $location = $_POST["location"];
    $products = $_POST["products"];
    $description = $_POST["description"];
    
    
    $photoPaths = [];
    if (isset($_FILES['photos'])) {
        $photos = $_FILES['photos'];
        $uploadDir = 'uploads/';  
        foreach ($photos['tmp_name'] as $key => $tmpName) {
            $fileName = basename($photos['name'][$key]);
            $filePath = $uploadDir . uniqid() . "_" . $fileName;
            if (move_uploaded_file($tmpName, $filePath)) {
                $photoPaths[] = $filePath; 
            }
        }
    }
    
    
    $photoPathsString = implode(',', $photoPaths);

    try {
        
        require_once "connect.php";  

       
        $query = "INSERT INTO cadastrodaempresa (NomeCompleto, NomeDoNegocio, Email, Password, Telefone, Localizacao, Produtos, Descricao, Fotos) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($query);

       
        $stmt->execute([$name, $business, $email, $password, $phone, $location, $products, $description, $photoPathsString]);

     
        echo "Empresa cadastrada com sucesso!";
    } catch (PDOException $e) {
        
        die("Query failed: " . $e->getMessage());
    }
} else {
   
    header("Location: ../Home.html");
    exit();
}
?>
