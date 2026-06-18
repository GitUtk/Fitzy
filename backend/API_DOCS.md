# Fitzy Backend API Docs
## Base URL

```
https://fitzy-f7uv.onrender.com/api/v1/
```

## Authentication

All protected routes require a Bearer token in the request header:

```
Authorization: Bearer <access_token>
```

Tokens are obtained via the `/login` endpoint and expire after 3600 minutes by default.

---

## Endpoints

### Health Check

#### `GET /health`

Checks API and database connectivity. No auth required.

**Response — 200 OK**
```json
{
  "status": "ok",
  "database": "up"
}
```

| Field | Possible Values |
|---|---|
| `status` | `ok` |
| `database` | `up`, `down` |

---

### Register User

#### `POST /register`

Creates a new user account.

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response — 200 OK**
```json
{
  "id": "64f1c9c2a1b2c3d4e5f6g7h8",
  "email": "user@example.com"
}
```

**Errors**

| Status | Meaning |
|---|---|
| 400 | User already exists |

---

### Login

#### `POST /login`

Authenticates a user and returns a JWT access token. Uses OAuth2 password flow (`form-data`, not JSON).

**Request — form-data**
```
username: user@example.com
password: yourpassword
```

**Response — 200 OK**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Errors**

| Status | Meaning |
|---|---|
| 400 | Invalid credentials |

---

### Get Current User

#### `GET /me`

Returns the authenticated user's profile.

**Headers**
```
Authorization: Bearer <access_token>
```

**Response — 200 OK**
```json
{
  "id": "64f1c9c2a1b2c3d4e5f6g7h8",
  "email": "user@example.com"
}
```

**Errors**

| Status | Meaning |
|---|---|
| 401 | Invalid or missing token |
| 404 | User not found |

---

## Authentication Flow

```
1. POST /register        → create account
2. POST /login            → exchange credentials for JWT
3. GET  /me  (Bearer)     → access protected resource
```

## Token Details

| Property | Value |
|---|---|
| Type | JWT |
| Algorithm | HS256 |
| Expiry | 3600 minutes (default) |

## Database Schema

**Database:** MongoDB
**Driver:** Motor (async)
**Collection:** `users`

```json
{
  "_id": "ObjectId",
  "email": "string",
  "password": "hashed string"
}
```

## Error Format

All errors follow a consistent shape:

```json
{
  "detail": "Error message here"
}
```

---

### Notes for Integrators

- `/login` expects `application/x-www-form-urlencoded` (standard OAuth2 form), not JSON — most HTTP clients need an explicit content-type override for this endpoint.
- Store the `access_token` securely (e.g. httpOnly cookie or secure storage) and attach it as a Bearer token on all subsequent requests to protected routes.
- Tokens are not refreshed automatically; re-authenticate via `/login` once expired.
