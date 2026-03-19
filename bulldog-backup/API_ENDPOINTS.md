# Bulldog API Endpoints Documentation

**Base URL:** `http://localhost:5000`  
**API Version:** v1  
**Last Updated:** March 19, 2026

---

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Bank Accounts](#bank-accounts)
4. [Incomes](#incomes)
5. [Expenses](#expenses)

---

## Authentication

### Login

**Endpoint:** `POST /api/v1/auth/login`

Create a new user session and obtain access tokens.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user_id": 1
}
```

Set-Cookie: `refresh_token=...` (httponly)

**Error Responses:**

- `400` - Email and password are required
- `401` - Invalid email or password

---

### Refresh Token

**Endpoint:** `POST /api/v1/auth/refresh`

Generate a new access token using the refresh token.

**Request:**
Requires `refresh_token` cookie

**Response (200):**

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Error Responses:**

- `401` - Missing refresh token
- `401` - Refresh token expired
- `401` - Invalid refresh token

---

### Logout

**Endpoint:** `POST /api/v1/auth/logout`

Invalidate the user session by clearing the refresh token.

**Request:**
Requires `refresh_token` cookie

**Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

---

## Users

### Create User

**Endpoint:** `POST /api/v1/users`

Create a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "password": "securePassword123"
}
```

**Response (201):**

```json
{
  "message": "User created successfully"
}
```

**Error Responses:**

- `400` - Invalid input
- `500` - Server error

---

### Get All Users

**Endpoint:** `GET /api/v1/users`

Retrieve a list of all users.

**Response (200):**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": 28
  }
]
```

---

### Get User by ID

**Endpoint:** `GET /api/v1/users/<user_id>`

Retrieve details of a specific user.

**Path Parameters:**

- `user_id` (integer, required) - The ID of the user

**Response (200):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

**Error Responses:**

- `404` - User not found

---

### Update User

**Endpoint:** `PUT /api/v1/users/<user_id>`

Update user information.

**Path Parameters:**

- `user_id` (integer, required) - The ID of the user

**Request Body:**

```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "age": 31,
  "password": "newPassword123"
}
```

**Response (200):**

```json
{
  "message": "User updated successfully"
}
```

**Error Responses:**

- `400` - Invalid input
- `404` - User not found
- `500` - Server error

---

### Delete User

**Endpoint:** `DELETE /api/v1/users/<user_id>`

Delete a user account.

**Path Parameters:**

- `user_id` (integer, required) - The ID of the user

**Response (200):**

```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**

- `404` - User not found
- `500` - Server error

---

## Bank Accounts

### Create Bank Account

**Endpoint:** `POST /api/v1/bank-accounts`

Create a new bank account for a user.

**Request Body:**

```json
{
  "user_id": 1,
  "bank_name": "Chase Bank",
  "account_number": "1234567890",
  "routing_number": "021000021",
  "account_type": "Checking",
  "alias": "My Checking Account",
  "balance": 5000.0
}
```

**Response (201):**

```json
{
  "id": 1,
  "user_id": 1,
  "bank_name": "Chase Bank",
  "account_number": "1234567890",
  "routing_number": "021000021",
  "account_type": "Checking",
  "alias": "My Checking Account",
  "balance": 5000.0
}
```

**Error Responses:**

- `400` - Invalid request payload (missing required fields)
- `500` - Server error

---

### Get Bank Accounts by User ID

**Endpoint:** `GET /api/v1/bank-accounts/user/<user_id>`

Retrieve all bank accounts for a specific user.

**Path Parameters:**

- `user_id` (integer, required) - The ID of the user

**Response (200):**

```json
[
  {
    "id": 1,
    "user_id": 1,
    "bank_name": "Chase Bank",
    "account_number": "1234567890",
    "routing_number": "021000021",
    "account_type": "Checking",
    "balance": 5000.0
  },
  {
    "id": 2,
    "user_id": 1,
    "bank_name": "Bank of America",
    "account_number": "9876543210",
    "routing_number": "026009593",
    "account_type": "Savings",
    "balance": 10000.0
  }
]
```

---

### Get Bank Account by ID

**Endpoint:** `GET /api/v1/bank-accounts/<account_id>`

Retrieve details of a specific bank account.

**Path Parameters:**

- `account_id` (integer, required) - The ID of the bank account

**Response (200):**

```json
{
  "id": 1,
  "user_id": 1,
  "bank_name": "Chase Bank",
  "account_number": "1234567890",
  "routing_number": "021000021",
  "account_type": "Checking",
  "balance": 5000.0
}
```

**Error Responses:**

- `404` - Bank account not found

---

### Update Bank Account

**Endpoint:** `PUT /api/v1/bank-accounts/<account_id>`

Update bank account information.

**Path Parameters:**

- `account_id` (integer, required) - The ID of the bank account

**Request Body:**

```json
{
  "bank_name": "Chase Bank Updated",
  "account_number": "1234567890",
  "routing_number": "021000021",
  "account_type": "Checking",
  "alias": "Updated Alias",
  "balance": 6000.0
}
```

**Response (200):**

```json
{
  "id": 1,
  "user_id": 1,
  "bank_name": "Chase Bank Updated",
  "account_number": "1234567890",
  "routing_number": "021000021",
  "account_type": "Checking",
  "alias": "Updated Alias",
  "balance": 6000.0
}
```

**Error Responses:**

- `400` - Invalid input
- `404` - Bank account not found

---

### Delete Bank Account

**Endpoint:** `DELETE /api/v1/bank-accounts/<account_id>`

Delete a bank account.

**Path Parameters:**

- `account_id` (integer, required) - The ID of the bank account

**Response (200):**

```json
{
  "message": "Bank account deleted successfully"
}
```

**Error Responses:**

- `404` - Bank account not found

---

### Get Incomes by User ID

**Endpoint:** `GET /api/v1/bank-accounts/users/<user_id>/incomes`

Retrieve all incomes for a specific user.

**Path Parameters:**

- `user_id` (integer, required) - The ID of the user

**Response (200):**

```json
[
  {
    "id": 1,
    "user_id": 1,
    "bank_account_id": 1,
    "amount": 2500.0,
    "description": "Monthly salary",
    "date": "2026-03-19"
  }
]
```

**Error Responses:**

- `500` - Server error

---

## Incomes

### Create Income

**Endpoint:** `POST /api/v1/incomes`

Create a new income record.

**Request Body:**

```json
{
  "bank_account_id": 1,
  "amount": 2500.0,
  "description": "Monthly salary",
  "date": "2026-03-19"
}
```

**Response (201):**

```json
{
  "id": 1,
  "bank_account_id": 1,
  "amount": 2500.0,
  "description": "Monthly salary",
  "date": "2026-03-19"
}
```

**Error Responses:**

- `400` - Invalid input
- `500` - Server error

---

### Get Income by ID

**Endpoint:** `GET /api/v1/incomes/<income_id>`

Retrieve details of a specific income record.

**Path Parameters:**

- `income_id` (integer, required) - The ID of the income

**Response (200):**

```json
{
  "id": 1,
  "bank_account_id": 1,
  "amount": 2500.0,
  "description": "Monthly salary",
  "date": "2026-03-19"
}
```

**Error Responses:**

- `404` - Income not found

---

### Get Incomes by Bank Account ID

**Endpoint:** `GET /api/v1/incomes/bank-account/<bank_account_id>`

Retrieve all incomes for a specific bank account.

**Path Parameters:**

- `bank_account_id` (integer, required) - The ID of the bank account

**Response (200):**

```json
[
  {
    "id": 1,
    "bank_account_id": 1,
    "amount": 2500.0,
    "description": "Monthly salary",
    "date": "2026-03-19"
  },
  {
    "id": 2,
    "bank_account_id": 1,
    "amount": 500.0,
    "description": "Freelance work",
    "date": "2026-03-18"
  }
]
```

---

### Update Income

**Endpoint:** `PUT /api/v1/incomes/<income_id>`

Update an existing income record.

**Path Parameters:**

- `income_id` (integer, required) - The ID of the income

**Request Body:**

```json
{
  "amount": 2600.0,
  "description": "Monthly salary (updated)",
  "date": "2026-03-19"
}
```

**Response (200):**

```json
{
  "id": 1,
  "bank_account_id": 1,
  "amount": 2600.0,
  "description": "Monthly salary (updated)",
  "date": "2026-03-19"
}
```

**Error Responses:**

- `400` - Invalid input
- `404` - Income not found

---

### Delete Income

**Endpoint:** `DELETE /api/v1/incomes/<income_id>`

Delete an income record.

**Path Parameters:**

- `income_id` (integer, required) - The ID of the income

**Response (204):** No content

**Error Responses:**

- `404` - Income not found

---

## Expenses

### Create Expense

**Endpoint:** `POST /api/v1/expenses`

Create a new expense record.

**Request Body:**

```json
{
  "user_id": 1,
  "amount": 50.0,
  "category": "Groceries",
  "date": "2026-03-19",
  "hour": "14:30",
  "description": "Weekly groceries"
}
```

**Response (201):**

```json
{
  "id": 1,
  "user_id": 1,
  "amount": 50.0,
  "category": "Groceries",
  "date": "2026-03-19",
  "hour": "14:30",
  "description": "Weekly groceries"
}
```

**Error Responses:**

- `400` - Invalid input
- `500` - Server error

---

### Get All Expenses

**Endpoint:** `GET /api/v1/expenses`

Retrieve all expenses with pagination support.

**Query Parameters:**

- `page` (integer, optional, default: 1) - Page number
- `per_page` (integer, optional, default: 10) - Items per page

**Response (200):**

```json
{
  "expenses": [
    {
      "id": 1,
      "user_id": 1,
      "amount": 50.0,
      "category": "Groceries",
      "date": "2026-03-19",
      "hour": "14:30",
      "description": "Weekly groceries"
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 10
}
```

**Error Responses:**

- `500` - Server error

---

### Get Expense by ID

**Endpoint:** `GET /api/v1/expenses/<expense_id>`

Retrieve details of a specific expense.

**Path Parameters:**

- `expense_id` (integer, required) - The ID of the expense

**Response (200):**

```json
{
  "id": 1,
  "user_id": 1,
  "amount": 50.0,
  "category": "Groceries",
  "date": "2026-03-19",
  "hour": "14:30",
  "description": "Weekly groceries"
}
```

**Error Responses:**

- `404` - Expense not found
- `500` - Server error

---

### Get Expenses by User ID

**Endpoint:** `GET /api/v1/expenses/user/<user_id>`

Retrieve all expenses for a specific user.

**Path Parameters:**

- `user_id` (integer, required) - The ID of the user

**Response (200):**

```json
[
  {
    "id": 1,
    "user_id": 1,
    "amount": 50.0,
    "category": "Groceries",
    "date": "2026-03-19",
    "hour": "14:30",
    "description": "Weekly groceries"
  },
  {
    "id": 2,
    "user_id": 1,
    "amount": 25.0,
    "category": "Transport",
    "date": "2026-03-18",
    "hour": "09:15",
    "description": "Gas"
  }
]
```

**Error Responses:**

- `500` - Server error

---

### Update Expense

**Endpoint:** `PUT /api/v1/expenses/<expense_id>`

Update an existing expense record.

**Path Parameters:**

- `expense_id` (integer, required) - The ID of the expense

**Request Body:**

```json
{
  "user_id": 1,
  "amount": 55.0,
  "category": "Groceries",
  "date": "2026-03-19",
  "hour": "14:30",
  "description": "Weekly groceries (updated)"
}
```

**Response (200):**

```json
{
  "id": 1,
  "user_id": 1,
  "amount": 55.0,
  "category": "Groceries",
  "date": "2026-03-19",
  "hour": "14:30",
  "description": "Weekly groceries (updated)"
}
```

**Error Responses:**

- `400` - Invalid input
- `404` - Expense not found
- `500` - Server error

---

### Delete Expense

**Endpoint:** `DELETE /api/v1/expenses/<expense_id>`

Delete an expense record.

**Path Parameters:**

- `expense_id` (integer, required) - The ID of the expense

**Response (200):**

```json
{
  "message": "Expense deleted successfully"
}
```

**Error Responses:**

- `404` - Expense not found
- `500` - Server error

---

## Summary

| Module         | Endpoints | Methods                |
| -------------- | --------- | ---------------------- |
| Authentication | 3         | POST                   |
| Users          | 5         | POST, GET, PUT, DELETE |
| Bank Accounts  | 5         | POST, GET, PUT, DELETE |
| Incomes        | 5         | POST, GET, PUT, DELETE |
| Expenses       | 6         | POST, GET, PUT, DELETE |
| **Total**      | **24**    | -                      |

---

## Security Notes

⚠️ **Important Security Concerns:**

1. **Hardcoded Secret Key** - The JWT secret key is hardcoded. Use environment variables in production.
2. **No Authentication Middleware** - Protected endpoints lack auth verification.
3. **No Authorization Checks** - Users can access/modify other users' data.
4. **Missing Input Validation** - Some endpoints don't validate input properly.
5. **Inconsistent Error Handling** - Some endpoints return incomplete responses.

---

## Common HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 204  | No Content            |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 404  | Not Found             |
| 500  | Internal Server Error |
