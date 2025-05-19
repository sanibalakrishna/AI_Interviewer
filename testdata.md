# Resume Upload API - Test Data Guide

This guide provides test data to help you validate your Resume Upload API using Postman.

## Setup Instructions

1. Import the provided Postman collection (Resume-Upload-API.postman_collection.json)
2. Set the following environment variables in Postman:
   - `baseUrl`: http://localhost:5000 (or your server URL)
   - `authToken`: (This will be populated automatically after login)

## Test Data for Each Endpoint

### 1. Register User

**POST /api/users/register**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (201 Created):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 2. Login User

**POST /api/users/login**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (200 OK):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

> After receiving the token, set the `authToken` environment variable in Postman with the token value.

### 3. Get Current User

**GET /api/users/me**

_Headers:_

```
Authorization: Bearer {{authToken}}
```

**Expected Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2023-05-18T10:00:00.000Z"
  }
}
```

### 4. Update User

**PUT /api/users/me**

_Headers:_

```
Authorization: Bearer {{authToken}}
```

_Body:_

```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Expected Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "createdAt": "2023-05-18T10:00:00.000Z"
  }
}
```

### 5. Upload Resume

**POST /api/upload/resume**

_Headers:_

```
Authorization: Bearer {{authToken}}
```

_Form-data:_

- Key: "resume"
- Type: File
- Value: [Select a PDF, DOC, or DOCX file]

**Expected Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "resume": "uploads/resumes/60d21b4667d0d8992e610c85-1621345678912.pdf",
    "createdAt": "2023-05-18T10:00:00.000Z"
  },
  "message": "Resume uploaded successfully"
}
```

## Testing Workflow

1. Start your Node.js server
2. Register a new user
3. Login to get a token (save the token to your environment variable)
4. Test getting user information
5. Test updating user information
6. Test uploading a resume

## Error Scenarios to Test

### 1. Register with Existing Email

```json
{
  "name": "Another User",
  "email": "john@example.com", // Already registered email
  "password": "password456"
}
```

**Expected Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "User with this email already exists"
}
```

### 2. Login with Wrong Password

```json
{
  "email": "john@example.com",
  "password": "wrongpassword"
}
```

**Expected Response (401 Unauthorized):**

```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

### 3. Access Protected Route without Token

**GET /api/users/me**
_No Authorization header_

**Expected Response (401 Unauthorized):**

```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

### 4. Upload Invalid File Type

_Form-data:_

- Key: "resume"
- Type: File
- Value: [Select a file that is not PDF, DOC, or DOCX, e.g., an image]

**Expected Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Error: Only PDF, DOC, and DOCX files are allowed!"
}
```
