
# Dragon Ball Fusion API Documentation

## URL Deployment
```
https://ip-amazingdragonball.web.app/
```

## Base URL
```
https://ip.fiqar.space
```

## Authentication
Most endpoints require a valid JWT `access_token` via `Authorization` header.

---

## Auth Endpoints

### POST `/register`
**Description:** Register a new user.

**Body Parameters:**
```json
{
  "email": "user@example.com",
  "password": "yourPassword",
  "username": "yourUsername"
}
```

**Response:**
- `201 Created` with user data (password excluded).

---

### POST `/login`
**Description:** Log in with email and password.

**Body Parameters:**
```json
{
  "email": "user@example.com",
  "password": "yourPassword"
}
```

**Response:**
- `200 OK` with `{ "access_token": "..." }`.

---

### POST `/login-google`
**Description:** Log in or register with Google OAuth.

**Body Parameters:**
```json
{
  "googleToken": "Google_ID_Token"
}
```

**Response:**
- `200 OK` with `{ "access_token": "..." }`.

---

## User Endpoints

### GET `/users/profile`
**Description:** Get current user's profile.  
**Auth Required**

**Response:**
- `200 OK` with user data.

---

### PATCH `/users/edit`
**Description:** Edit current user's profile.  
**Auth Required**

**Body Parameters (any field):**
```json
{
  "email": "new@example.com",
  "username": "newUsername",
  "password": "newPassword"
}
```

**Response:**
- `200 OK` with update message and updated user.

---

### DELETE `/users/:id`
**Description:** Delete a user by ID.  
**Auth Required**

**Response:**
- `200 OK` with success message.

---

## Fusion Endpoint

### POST `/fusion`
**Description:** Generate a fused character image using Google Gemini AI.  
**Body Parameters:**
```json
{
  "character1": { ... },
  "character2": { ... }
}
```

**Response:**
- `200 OK` with `{ "image": "base64-encoded-image" }`.

---

## Dragon Ball API (3rd Party) Proxy Endpoints  
**All Require Auth**

### GET `/characters`
**Query Params:** `page`, `limit`  
**Response:** List of characters.

### GET `/characters/:id`  
**Response:** Character details by ID.

---

### GET `/planets`
**Query Params:** `page`, `limit`  
**Response:** List of planets.

### GET `/planets/:id`  
**Response:** Planet details by ID.

---

### GET `/transformations`  
**Response:** List of transformations.

### GET `/transformations/:id`  
**Response:** Transformation details by ID.

---

## Errors
All error responses follow the format:
```json
{
  "error": "Error message"
}
```

### Common Error Statuses:
- `400 Bad Request`
- `401 Unauthorized`
- `404 Not Found`
- `500 Internal Server Error`
