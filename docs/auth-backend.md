# Auth backend requirements (PHP)

This app expects the backend to own session cookies. Frontend login calls should
receive a token and the server should also set a secure, httpOnly cookie. The
examples below show a minimal, production-ready PHP implementation.

## `login.php` (issue httpOnly cookie)

```php
<?php
declare(strict_types=1);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: https://your-frontend-domain.com");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}

$input = json_decode(file_get_contents("php://input"), true) ?? [];
$phone = $input["phoneNumber"] ?? "";
$password = $input["password"] ?? "";

// TODO: validate credentials against DB
if ($phone === "" || $password === "") {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Missing credentials."]);
  exit;
}

// Example: issue JWT or opaque token
$token = base64_encode(random_bytes(32));

// httpOnly cookie (production)
setcookie(
  "kaya_token",
  $token,
  [
    "expires" => time() + 60 * 60 * 24 * 7,
    "path" => "/",
    "secure" => true,
    "httponly" => true,
    "samesite" => "Lax",
  ]
);

echo json_encode([
  "success" => true,
  "token" => $token,
  "user" => [
    "id" => "123",
    "email" => "user@example.com",
    "fullName" => "Example User",
    "phone" => $phone,
  ],
]);
```

## `session.php` (validate cookie)

```php
<?php
declare(strict_types=1);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: https://your-frontend-domain.com");
header("Access-Control-Allow-Credentials: true");

$token = $_COOKIE["kaya_token"] ?? "";
if ($token === "") {
  http_response_code(401);
  echo json_encode(["success" => false, "message" => "Unauthenticated."]);
  exit;
}

// TODO: validate token in DB / JWT
echo json_encode(["success" => true]);
```

## `logout.php` (clear cookie)

```php
<?php
declare(strict_types=1);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: https://your-frontend-domain.com");
header("Access-Control-Allow-Credentials: true");

setcookie("kaya_token", "", [
  "expires" => time() - 3600,
  "path" => "/",
  "secure" => true,
  "httponly" => true,
  "samesite" => "Lax",
]);

echo json_encode(["success" => true]);
```

## Notes
- Use `Secure` cookies in production (HTTPS only).
- Keep CORS `Access-Control-Allow-Credentials: true` so cookies flow.
- Tokens should be validated server-side on every authenticated request.
