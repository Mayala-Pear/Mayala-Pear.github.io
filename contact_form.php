<?php
// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $message = htmlspecialchars(trim($_POST['message']));

    // Validate form data
    if (!empty($name) && !empty($email) && !empty($message) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Email parameters
        $to = "a.meagan21@gmail.com"; 
        $subject = "New Contact Form Submission from $name";
        $body = "You have received a new message from your website contact form.\n\n".
                "Here are the details:\n\n".
                "Name: $name\n".
                "Email: $email\n".
                "Message:\n$message";

        $headers = "From: $email\r\n";
        $headers .= "Reply-To: $email\r\n";

        // Send email
        if (mail($to, $subject, $body, $headers)) {
            echo "Thank you for contacting me. I will get back to you soon.";
        } else {
            echo "Sorry, there was an error sending your message. Please try again later.";
        }
    } else {
        echo "Please complete all fields and provide a valid email address.";
    }
} else {
    // Redirect back to form if accessed directly
    header("Location: contact.html");
    exit;
}
?>
