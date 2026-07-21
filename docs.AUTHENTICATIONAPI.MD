# Authentication API Documentation

## Overview

The Authentication API provides user authentication and authorization features using:

* JWT Access Tokens
* Refresh Tokens
* Password Hashing
* Role-Based Authorization
* SQL Server Database

The API supports:

* User registration
* User login
* Access token generation
* Refresh token rotation
* Logout
* Protected routes
* Admin authorization

---

# Authentication Flow

## 1. Register User

Creates a new user account.

### Endpoint

```
POST /api/auth/register
```

### Request Body

```json
{
    "name": "John Doe",
    "email": "john@test.com",
    "password": "123456"
}
```

### Validation

Required fields:

* name
* email
* password

### Success Response

Status:

```
201 Created
```

Response:

```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@test.com",
        "role": "user"
    }
}
```

### Error Responses

Missing fields:

```
400 Bad Request
```

```json
{
    "message": "All fields are required"
}
```

Duplicate email:

```
409 Conflict
```

```json
{
    "message": "Email already exist"
}
```

---

# Login

Authenticates a user and generates tokens.

## Endpoint

```
POST /api/auth/login
```

## Request Body

```json
{
    "email": "john@test.com",
    "password": "123456"
}
```

## Success Response

Status:

```
200 OK
```

Response:

```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "accessToken": "jwt_access_token",
        "refreshToken": "refresh_token",
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@test.com",
            "role": "user"
        }
    }
}
```

---

## Login Errors

Invalid credentials:

```
401 Unauthorized
```

```json
{
    "message": "Invalid email or password"
}
```

Missing credentials:

```
400 Bad Request
```

```json
{
    "message": "Email and Password are required"
}
```

---

# JWT Authentication

Protected routes require an access token.

## Authorization Header

```
Authorization: Bearer {accessToken}
```

Example:

```
Authorization: Bearer eyJhbGciOiJIUzI1...
```

---

# Refresh Token

Generates a new access token and refresh token.

## Endpoint

```
POST /api/auth/refresh-token
```

## Request Body

```json
{
    "refreshToken": "existing_refresh_token"
}
```

## Success Response

Status:

```
200 OK
```

```json
{
    "success": true,
    "message": "Token refreshed successfully",
    "data": {
        "accessToken": "new_access_token",
        "refreshToken": "new_refresh_token"
    }
}
```

The old refresh token becomes invalid after rotation.

---

## Refresh Token Errors

Missing refresh token:

```
400 Bad Request
```

```json
{
    "message": "Refresh token is required"
}
```

Invalid refresh token:

```
401 Unauthorized
```

```json
{
    "message": "Invalid refresh token"
}
```

---

# Logout

Removes the stored refresh token from the user account.

## Endpoint

```
POST /api/auth/logout
```

## Authorization

Required:

```
Bearer Access Token
```

## Success Response

```json
{
    "success": true,
    "message": "Logout successful"
}
```

---

# Authorization Roles

The system supports role-based authorization.

Available roles:

| Role  | Permission            |
| ----- | --------------------- |
| user  | Standard user access  |
| admin | Administrative access |

---

# Admin Access Example

## Endpoint

```
GET /api/admin/dashboard
```

Required:

```
Authorization: Bearer {admin_access_token}
```

## Success Response

```json
{
    "message": "Welcome to admin dashboard",
    "user": {
        "id": 1,
        "role": "admin"
    }
}
```

---

## Normal User Access

If a normal user attempts to access an admin route:

Response:

```
403 Forbidden
```

---

# Middleware

## Authentication Middleware

File:

```
middleware/auth.middleware.ts
```

Responsibilities:

* Validate JWT token
* Extract user information
* Attach user data to request

Example:

```typescript
req.user = {
    id: 1,
    role: "user"
}
```

---

## Role Middleware

File:

```
middleware/role.middleware.ts
```

Responsibilities:

* Check user permissions
* Restrict unauthorized roles

Example:

```typescript
authorize("admin")
```

Only admin users can continue.

---

# Database User Structure

Table:

```
Users
```

Columns:

| Column       | Type     |
| ------------ | -------- |
| id           | int      |
| name         | varchar  |
| email        | varchar  |
| passwordHash | varchar  |
| role         | varchar  |
| refreshToken | varchar  |
| createdAt    | datetime |

---

# Security Features

Implemented:

* Password hashing using bcrypt
* JWT authentication
* Refresh token rotation
* Role-based authorization
* Protected routes
* Token expiration handling
* Input validation

---

# Testing

Testing framework:

```
Jest
```

API testing:

```
Supertest
```

Current coverage:

* Registration
* Duplicate registration
* Login
* Invalid login
* JWT authentication
* Expired tokens
* Refresh tokens
* Logout
* Admin authorization
* Validation errors
* Error handling

---

# Project Structure

```
src
│
├── controllers
│   └── auth.controller.ts
│
├── middleware
│   ├── auth.middleware.ts
│   ├── role.middleware.ts
│   └── error.middleware.ts
│
├── routes
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   └── admin.routes.ts
│
├── services
│   └── user.services.ts
│
├── utils
│   ├── jwt.ts
│   ├── password.ts
│   ├── refreshToken.ts
│   └── response.ts
│
└── config
    └── db.ts
```
