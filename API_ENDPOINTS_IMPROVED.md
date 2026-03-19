# Bulldog API - Personal Finance Management System

**Base URL:** `http://localhost:5000`  
**API Version:** v1  
**Last Updated:** March 19, 2026  
**Purpose:** Track bank accounts and manage financial transactions (deposits, withdrawals, transfers)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Bank Accounts](#bank-accounts)
4. [Transactions](#transactions)
5. [Transfers](#transfers)
6. [Categories](#categories)
7. [Reports](#reports)

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
  "user_id": 1,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com"
  }
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
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "expires_in": 900
}
```

**Error Responses:**

- `401` - Missing refresh token
- `401` - Refresh token expired or revoked
- `401` - Invalid refresh token

---

### Logout

**Endpoint:** `POST /api/v1/auth/logout`

Invalidate the user session by revoking the refresh token.

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

Register a new user account.

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
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "created_at": "2026-03-19T10:00:00Z"
}
```

**Error Responses:**

- `400` - Invalid input or email already exists
- `400` - Password must be at least 8 characters
- `500` - Server error

---

### Get Current User

**Endpoint:** `GET /api/v1/users/me`

Retrieve current authenticated user details.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "created_at": "2026-03-19T10:00:00Z",
  "updated_at": "2026-03-19T10:00:00Z"
}
```

**Error Responses:**

- `401` - Unauthorized

---

### Get User by ID

**Endpoint:** `GET /api/v1/users/<user_id>`

Retrieve details of a specific user (admin only).

**Path Parameters:**

- `user_id` (integer, required) - The ID of the user

**Response (200):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "created_at": "2026-03-19T10:00:00Z"
}
```

**Error Responses:**

- `401` - Unauthorized
- `403` - Forbidden (not admin)
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
  "age": 31
}
```

**Response (200):**

```json
{
  "id": 1,
  "name": "John Updated",
  "email": "john.updated@example.com",
  "age": 31,
  "updated_at": "2026-03-19T11:00:00Z"
}
```

**Error Responses:**

- `400` - Invalid input
- `401` - Unauthorized
- `403` - Can only update your own profile
- `404` - User not found

---

### Delete User

**Endpoint:** `DELETE /api/v1/users/<user_id>`

Delete a user account and all associated data.

**Path Parameters:**

- `user_id` (integer, required) - The ID of the user

**Response (204):** No content

**Error Responses:**

- `401` - Unauthorized
- `403` - Can only delete your own account
- `404` - User not found

---

## Bank Accounts

### Create Bank Account

**Endpoint:** `POST /api/v1/bank-accounts`

Create a new bank account for the current user.

**Request Body:**

```json
{
  "bank_name": "Chase Bank",
  "account_number": "1234567890",
  "routing_number": "021000021",
  "account_type": "Checking",
  "alias": "My Checking Account",
  "initial_balance": 5000.0,
  "currency": "USD"
}
```

**Response (201):**

```json
{
  "id": 1,
  "user_id": 1,
  "bank_name": "Chase Bank",
  "account_number": "****7890",
  "routing_number": "021000021",
  "account_type": "Checking",
  "alias": "My Checking Account",
  "current_balance": 5000.0,
  "initial_balance": 5000.0,
  "currency": "USD",
  "is_active": true,
  "created_at": "2026-03-19T10:00:00Z"
}
```

**Error Responses:**

- `400` - Invalid request (missing required fields)
- `400` - Account number already exists for this user
- `401` - Unauthorized
- `500` - Server error

---

### Get All User Bank Accounts

**Endpoint:** `GET /api/v1/bank-accounts`

Retrieve all bank accounts for the current user.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "accounts": [
    {
      "id": 1,
      "bank_name": "Chase Bank",
      "account_number": "****7890",
      "account_type": "Checking",
      "alias": "My Checking Account",
      "current_balance": 8500.0,
      "currency": "USD",
      "is_active": true,
      "last_transaction": "2026-03-19T14:30:00Z"
    },
    {
      "id": 2,
      "bank_name": "Bank of America",
      "account_number": "****3210",
      "account_type": "Savings",
      "alias": "My Savings Account",
      "current_balance": 16500.0,
      "currency": "USD",
      "is_active": true,
      "last_transaction": "2026-03-18T10:15:00Z"
    }
  ],
  "total_accounts": 2,
  "total_balance": 25000.0,
  "currency": "USD"
}
```

**Error Responses:**

- `401` - Unauthorized

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
  "account_number": "****7890",
  "routing_number": "021000021",
  "account_type": "Checking",
  "alias": "My Checking Account",
  "current_balance": 8500.0,
  "initial_balance": 5000.0,
  "currency": "USD",
  "is_active": true,
  "created_at": "2026-03-19T10:00:00Z",
  "updated_at": "2026-03-19T10:00:00Z"
}
```

**Error Responses:**

- `401` - Unauthorized
- `403` - Account does not belong to current user
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
  "alias": "Updated Checking Account",
  "is_active": true
}
```

**Response (200):**

```json
{
  "id": 1,
  "bank_name": "Chase Bank Updated",
  "alias": "Updated Checking Account",
  "current_balance": 8500.0,
  "is_active": true,
  "updated_at": "2026-03-19T11:00:00Z"
}
```

**Error Responses:**

- `400` - Invalid input
- `401` - Unauthorized
- `403` - Account does not belong to current user
- `404` - Bank account not found

---

### Delete Bank Account

**Endpoint:** `DELETE /api/v1/bank-accounts/<account_id>`

Soft delete a bank account (mark as inactive).

**Path Parameters:**

- `account_id` (integer, required) - The ID of the bank account

**Response (204):** No content

**Error Responses:**

- `401` - Unauthorized
- `403` - Account does not belong to current user
- `404` - Bank account not found

---

### Get Account Summary Dashboard

**Endpoint:** `GET /api/v1/bank-accounts/<account_id>/summary`

Get comprehensive account summary with period statistics.

**Query Parameters:**

```
?period=MONTHLY  // DAILY, WEEKLY, MONTHLY, YEARLY
&year=2026
&month=03
```

**Response (200):**

```json
{
  "account": {
    "id": 1,
    "alias": "My Checking Account",
    "bank_name": "Chase Bank",
    "account_type": "Checking",
    "current_balance": 8500.0,
    "currency": "USD",
    "last_transaction": "2026-03-19T14:30:00Z"
  },
  "period_summary": {
    "year": 2026,
    "month": "March",
    "period": "2026-03-01 to 2026-03-31",
    "opening_balance": 5000.0,
    "closing_balance": 8500.0,
    "total_deposits": 5000.0,
    "total_withdrawals": 1200.0,
    "total_fees": 10.0,
    "total_interest": 5.25,
    "transaction_count": 18,
    "net_change": 3500.0,
    "change_percentage": 70.0
  },
  "transactions_by_type": {
    "DEPOSIT": {
      "count": 8,
      "amount": 5000.0,
      "percentage": 80.6
    },
    "WITHDRAWAL": {
      "count": 9,
      "amount": 1200.0,
      "percentage": 19.4
    },
    "FEE": {
      "count": 1,
      "amount": 10.0,
      "percentage": 0.16
    }
  },
  "transactions_by_category": {
    "DEPOSIT": {
      "Salary": { "count": 1, "amount": 3500.0 },
      "Bonus": { "count": 1, "amount": 1500.0 }
    },
    "WITHDRAWAL": {
      "Groceries": { "count": 4, "amount": 400.0 },
      "Transport": { "count": 3, "amount": 250.0 },
      "Entertainment": { "count": 2, "amount": 550.0 }
    }
  }
}
```

**Error Responses:**

- `401` - Unauthorized
- `403` - Account does not belong to current user
- `404` - Account not found

---

### Get All Accounts Summary

**Endpoint:** `GET /api/v1/bank-accounts/summary/all`

Get summary for all user accounts.

**Query Parameters:**

```
?period=MONTHLY  // DAILY, WEEKLY, MONTHLY, YEARLY
&year=2026
&month=03
```

**Response (200):**

```json
{
  "user_id": 1,
  "total_accounts": 3,
  "total_balance": 25000.0,
  "currency": "USD",
  "accounts": [
    {
      "id": 1,
      "alias": "Checking",
      "bank_name": "Chase",
      "account_type": "Checking",
      "current_balance": 8500.0,
      "last_transaction": "2026-03-19T14:30:00Z"
    },
    {
      "id": 2,
      "alias": "Savings",
      "bank_name": "Bank of America",
      "account_type": "Savings",
      "current_balance": 16500.0,
      "last_transaction": "2026-03-18T10:15:00Z"
    }
  ],
  "period_summary": {
    "total_deposits": 10000.0,
    "total_withdrawals": 2500.0,
    "total_fees": 50.0,
    "total_interest": 15.5,
    "net_change": 7465.0,
    "transaction_count": 45
  }
}
```

**Error Responses:**

- `401` - Unauthorized

---

## Transactions

### Create Transaction

**Endpoint:** `POST /api/v1/bank-accounts/<account_id>/transactions`

Record a new transaction (deposit, withdrawal, fee, interest).

**Path Parameters:**

- `account_id` (integer, required) - The ID of the bank account

**Request Body:**

```json
{
  "transaction_type": "DEPOSIT",
  "amount": 2500.0,
  "category": "Salary",
  "description": "Monthly salary",
  "reference_number": "REF-12345",
  "transaction_date": "2026-03-19",
  "transaction_time": "14:30:00",
  "notes": "March salary payment"
}
```

**Response (201):**

```json
{
  "id": 1,
  "bank_account_id": 1,
  "transaction_type": "DEPOSIT",
  "amount": 2500.0,
  "category": "Salary",
  "description": "Monthly salary",
  "reference_number": "REF-12345",
  "transaction_date": "2026-03-19",
  "transaction_time": "14:30:00",
  "status": "COMPLETED",
  "notes": "March salary payment",
  "new_balance": 8500.0,
  "created_at": "2026-03-19T14:35:00Z"
}
```

**Error Responses:**

- `400` - Invalid input
- `400` - Insufficient funds (for withdrawals)
- `401` - Unauthorized
- `403` - Account does not belong to current user
- `404` - Account not found

---

### Get Account Transactions

**Endpoint:** `GET /api/v1/bank-accounts/<account_id>/transactions`

Retrieve transactions for a specific account with advanced filtering.

**Path Parameters:**

- `account_id` (integer, required) - The ID of the bank account

**Query Parameters:**

```
?transaction_type=DEPOSIT      // DEPOSIT, WITHDRAWAL, TRANSFER_OUT, TRANSFER_IN, FEE, INTEREST
&category=Salary               // Filter by category
&start_date=2026-03-01         // ISO date format
&end_date=2026-03-31           // ISO date format
&status=COMPLETED              // PENDING, COMPLETED, FAILED, CANCELLED
&min_amount=0                  // Filter by minimum amount
&max_amount=5000               // Filter by maximum amount
&page=1                        // Pagination
&per_page=20                   // Items per page
&sort_by=transaction_date      // transaction_date, amount
&sort_order=DESC               // ASC, DESC
```

**Response (200):**

```json
{
  "account_id": 1,
  "transactions": [
    {
      "id": 1,
      "transaction_type": "DEPOSIT",
      "amount": 2500.0,
      "category": "Salary",
      "transaction_date": "2026-03-19",
      "transaction_time": "14:30:00",
      "status": "COMPLETED",
      "description": "Monthly salary",
      "reference_number": "REF-12345"
    },
    {
      "id": 2,
      "transaction_type": "WITHDRAWAL",
      "amount": 50.0,
      "category": "Groceries",
      "transaction_date": "2026-03-19",
      "transaction_time": "16:45:00",
      "status": "COMPLETED",
      "description": "Weekly groceries"
    }
  ],
  "pagination": {
    "total": 18,
    "page": 1,
    "per_page": 20,
    "total_pages": 1
  },
  "summary": {
    "total_deposits": 5000.0,
    "total_withdrawals": 1200.0,
    "total_fees": 10.0,
    "net_change": 3790.0,
    "average_transaction": 210.56
  }
}
```

**Error Responses:**

- `401` - Unauthorized
- `403` - Account does not belong to current user
- `404` - Account not found

---

### Get Transaction by ID

**Endpoint:** `GET /api/v1/bank-accounts/<account_id>/transactions/<transaction_id>`

Retrieve details of a specific transaction.

**Path Parameters:**

- `account_id` (integer, required) - The ID of the bank account
- `transaction_id` (integer, required) - The ID of the transaction

**Response (200):**

```json
{
  "id": 1,
  "bank_account_id": 1,
  "transaction_type": "DEPOSIT",
  "amount": 2500.0,
  "category": "Salary",
  "description": "Monthly salary",
  "reference_number": "REF-12345",
  "transaction_date": "2026-03-19",
  "transaction_time": "14:30:00",
  "status": "COMPLETED",
  "notes": "March salary payment",
  "created_at": "2026-03-19T14:35:00Z",
  "updated_at": "2026-03-19T14:35:00Z"
}
```

**Error Responses:**

- `401` - Unauthorized
- `403` - Account does not belong to current user
- `404` - Transaction not found

---

### Update Transaction

**Endpoint:** `PUT /api/v1/bank-accounts/<account_id>/transactions/<transaction_id>`

Update a transaction (only non-completed transactions).

**Path Parameters:**

- `account_id` (integer, required)
- `transaction_id` (integer, required)

**Request Body:**

```json
{
  "amount": 2600.0,
  "category": "Salary",
  "description": "Monthly salary (corrected)",
  "notes": "Final amount correction"
}
```

**Response (200):**

```json
{
  "id": 1,
  "transaction_type": "DEPOSIT",
  "amount": 2600.0,
  "category": "Salary",
  "description": "Monthly salary (corrected)",
  "status": "COMPLETED",
  "updated_at": "2026-03-19T15:00:00Z"
}
```

**Error Responses:**

- `400` - Cannot update completed transaction
- `401` - Unauthorized
- `403` - Account does not belong to current user
- `404` - Transaction not found

---

### Delete Transaction

**Endpoint:** `DELETE /api/v1/bank-accounts/<account_id>/transactions/<transaction_id>`

Delete a transaction.

**Path Parameters:**

- `account_id` (integer, required)
- `transaction_id` (integer, required)

**Response (204):** No content

**Error Responses:**

- `401` - Unauthorized
- `403` - Account does not belong to current user
- `404` - Transaction not found

---

## Transfers

### Create Transfer

**Endpoint:** `POST /api/v1/transfers`

Transfer funds between user's bank accounts.

**Request Body:**

```json
{
  "from_bank_account_id": 1,
  "to_bank_account_id": 2,
  "amount": 500.0,
  "description": "Transfer to savings",
  "transfer_date": "2026-03-19",
  "notes": "Monthly transfer"
}
```

**Response (201):**

```json
{
  "id": 1,
  "from_account": {
    "id": 1,
    "alias": "Checking",
    "previous_balance": 8500.0,
    "new_balance": 8000.0
  },
  "to_account": {
    "id": 2,
    "alias": "Savings",
    "previous_balance": 16500.0,
    "new_balance": 17000.0
  },
  "amount": 500.0,
  "description": "Transfer to savings",
  "transfer_date": "2026-03-19",
  "status": "COMPLETED",
  "from_transaction_id": 10,
  "to_transaction_id": 11,
  "created_at": "2026-03-19T14:35:00Z"
}
```

**Error Responses:**

- `400` - Invalid request (same account)
- `400` - Insufficient funds
- `401` - Unauthorized
- `403` - Accounts do not belong to current user
- `404` - Account not found

---

### Get User Transfers

**Endpoint:** `GET /api/v1/transfers`

Retrieve all transfers for the current user.

**Query Parameters:**

```
?start_date=2026-03-01
&end_date=2026-03-31
&status=COMPLETED        // PENDING, COMPLETED, FAILED
&page=1
&per_page=20
&sort_by=transfer_date
&sort_order=DESC
```

**Response (200):**

```json
{
  "transfers": [
    {
      "id": 1,
      "from_account": {
        "id": 1,
        "alias": "Checking",
        "bank_name": "Chase"
      },
      "to_account": {
        "id": 2,
        "alias": "Savings",
        "bank_name": "Bank of America"
      },
      "amount": 500.0,
      "transfer_date": "2026-03-19",
      "status": "COMPLETED"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "per_page": 20,
    "total_pages": 1
  }
}
```

**Error Responses:**

- `401` - Unauthorized

---

### Get Transfer by ID

**Endpoint:** `GET /api/v1/transfers/<transfer_id>`

Retrieve details of a specific transfer.

**Path Parameters:**

- `transfer_id` (integer, required)

**Response (200):**

```json
{
  "id": 1,
  "user_id": 1,
  "from_account": {
    "id": 1,
    "alias": "Checking",
    "bank_name": "Chase",
    "previous_balance": 8500.0,
    "new_balance": 8000.0
  },
  "to_account": {
    "id": 2,
    "alias": "Savings",
    "bank_name": "Bank of America",
    "previous_balance": 16500.0,
    "new_balance": 17000.0
  },
  "amount": 500.0,
  "description": "Transfer to savings",
  "transfer_date": "2026-03-19",
  "status": "COMPLETED",
  "from_transaction_id": 10,
  "to_transaction_id": 11,
  "created_at": "2026-03-19T14:35:00Z"
}
```

**Error Responses:**

- `401` - Unauthorized
- `404` - Transfer not found

---

## Categories

### Create Income Category

**Endpoint:** `POST /api/v1/users/income-categories`

Create a custom income category for the user.

**Request Body:**

```json
{
  "category_name": "Freelance Work",
  "icon": "briefcase",
  "color": "#4CAF50"
}
```

**Response (201):**

```json
{
  "id": 1,
  "user_id": 1,
  "category_name": "Freelance Work",
  "icon": "briefcase",
  "color": "#4CAF50",
  "is_active": true,
  "created_at": "2026-03-19T10:00:00Z"
}
```

**Error Responses:**

- `400` - Category name already exists
- `401` - Unauthorized

---

### Get Income Categories

**Endpoint:** `GET /api/v1/users/income-categories`

Retrieve all income categories for the user.

**Response (200):**

```json
{
  "categories": [
    {
      "id": 1,
      "category_name": "Salary",
      "icon": "dollar",
      "color": "#4CAF50",
      "is_active": true
    },
    {
      "id": 2,
      "category_name": "Freelance Work",
      "icon": "briefcase",
      "color": "#2196F3",
      "is_active": true
    },
    {
      "id": 3,
      "category_name": "Bonus",
      "icon": "gift",
      "color": "#FF9800",
      "is_active": true
    }
  ]
}
```

**Error Responses:**

- `401` - Unauthorized

---

### Update Income Category

**Endpoint:** `PUT /api/v1/users/income-categories/<category_id>`

Update an income category.

**Path Parameters:**

- `category_id` (integer, required)

**Request Body:**

```json
{
  "category_name": "Freelance/Contract Work",
  "icon": "briefcase",
  "color": "#2196F3"
}
```

**Response (200):**

```json
{
  "id": 1,
  "category_name": "Freelance/Contract Work",
  "icon": "briefcase",
  "color": "#2196F3",
  "is_active": true,
  "updated_at": "2026-03-19T11:00:00Z"
}
```

**Error Responses:**

- `400` - Invalid input
- `401` - Unauthorized
- `404` - Category not found

---

### Delete Income Category

**Endpoint:** `DELETE /api/v1/users/income-categories/<category_id>`

Delete an income category.

**Path Parameters:**

- `category_id` (integer, required)

**Response (204):** No content

**Error Responses:**

- `401` - Unauthorized
- `404` - Category not found

---

### Create Expense Category

**Endpoint:** `POST /api/v1/users/expense-categories`

Create a custom expense category for the user.

**Request Body:**

```json
{
  "category_name": "Groceries",
  "icon": "shopping-cart",
  "color": "#FF5722"
}
```

**Response (201):**

```json
{
  "id": 1,
  "user_id": 1,
  "category_name": "Groceries",
  "icon": "shopping-cart",
  "color": "#FF5722",
  "is_active": true,
  "created_at": "2026-03-19T10:00:00Z"
}
```

**Error Responses:**

- `400` - Category name already exists
- `401` - Unauthorized

---

### Get Expense Categories

**Endpoint:** `GET /api/v1/users/expense-categories`

Retrieve all expense categories for the user.

**Response (200):**

```json
{
  "categories": [
    {
      "id": 1,
      "category_name": "Groceries",
      "icon": "shopping-cart",
      "color": "#FF5722",
      "is_active": true
    },
    {
      "id": 2,
      "category_name": "Transport",
      "icon": "car",
      "color": "#2196F3",
      "is_active": true
    },
    {
      "id": 3,
      "category_name": "Entertainment",
      "icon": "film",
      "color": "#9C27B0",
      "is_active": true
    }
  ]
}
```

**Error Responses:**

- `401` - Unauthorized

---

### Update Expense Category

**Endpoint:** `PUT /api/v1/users/expense-categories/<category_id>`

Update an expense category.

**Path Parameters:**

- `category_id` (integer, required)

**Request Body:**

```json
{
  "category_name": "Food & Groceries",
  "icon": "shopping-cart",
  "color": "#E53935"
}
```

**Response (200):**

```json
{
  "id": 1,
  "category_name": "Food & Groceries",
  "icon": "shopping-cart",
  "color": "#E53935",
  "is_active": true,
  "updated_at": "2026-03-19T11:00:00Z"
}
```

**Error Responses:**

- `400` - Invalid input
- `401` - Unauthorized
- `404` - Category not found

---

### Delete Expense Category

**Endpoint:** `DELETE /api/v1/users/expense-categories/<category_id>`

Delete an expense category.

**Path Parameters:**

- `category_id` (integer, required)

**Response (204):** No content

**Error Responses:**

- `401` - Unauthorized
- `404` - Category not found

---

## Reports

### Get Monthly Report

**Endpoint:** `GET /api/v1/reports/monthly`

Generate a comprehensive monthly report.

**Query Parameters:**

```
?year=2026
&month=03
```

**Response (200):**

```json
{
  "report_period": {
    "year": 2026,
    "month": "March",
    "start_date": "2026-03-01",
    "end_date": "2026-03-31"
  },
  "accounts_summary": [
    {
      "account_id": 1,
      "alias": "Checking",
      "bank_name": "Chase Bank",
      "account_type": "Checking",
      "opening_balance": 5000.0,
      "closing_balance": 8500.0,
      "deposits": 5000.0,
      "withdrawals": 1200.0,
      "fees": 10.0,
      "interest": 5.25,
      "net_change": 3500.0,
      "change_percentage": 70.0,
      "transaction_count": 18
    }
  ],
  "total_summary": {
    "total_deposits": 10000.0,
    "total_withdrawals": 2500.0,
    "total_fees": 50.0,
    "total_interest": 10.5,
    "net_income": 7460.0,
    "total_accounts": 3
  },
  "top_income_categories": [
    {
      "category": "Salary",
      "amount": 7000.0,
      "percentage": 70.0,
      "transaction_count": 1,
      "average": 7000.0
    },
    {
      "category": "Bonus",
      "amount": 3000.0,
      "percentage": 30.0,
      "transaction_count": 1,
      "average": 3000.0
    }
  ],
  "top_expense_categories": [
    {
      "category": "Entertainment",
      "amount": 550.0,
      "percentage": 22.0,
      "transaction_count": 5,
      "average": 110.0
    },
    {
      "category": "Groceries",
      "amount": 400.0,
      "percentage": 16.0,
      "transaction_count": 4,
      "average": 100.0
    }
  ]
}
```

**Error Responses:**

- `401` - Unauthorized

---

### Get Custom Date Range Report

**Endpoint:** `GET /api/v1/reports/custom`

Generate a report for a custom date range.

**Query Parameters:**

```
?start_date=2026-03-01
&end_date=2026-03-31
```

**Response (200):**

```json
{
  "report_period": {
    "start_date": "2026-03-01",
    "end_date": "2026-03-31",
    "days": 31
  },
  "accounts_summary": [],
  "total_summary": {
    "total_deposits": 10000.0,
    "total_withdrawals": 2500.0,
    "total_fees": 50.0,
    "total_interest": 10.5,
    "net_income": 7460.0,
    "total_accounts": 3
  },
  "top_income_categories": [],
  "top_expense_categories": []
}
```

**Error Responses:**

- `400` - Invalid date format
- `400` - Start date must be before end date
- `401` - Unauthorized

---

### Get Account Transaction Report

**Endpoint:** `GET /api/v1/bank-accounts/<account_id>/report`

Generate a transaction report for a specific account.

**Query Parameters:**

```
?start_date=2026-03-01
&end_date=2026-03-31
```

**Response (200):**

```json
{
  "account": {
    "id": 1,
    "alias": "Checking",
    "bank_name": "Chase Bank",
    "account_type": "Checking"
  },
  "report_period": {
    "start_date": "2026-03-01",
    "end_date": "2026-03-31"
  },
  "summary": {
    "opening_balance": 5000.0,
    "closing_balance": 8500.0,
    "total_deposits": 5000.0,
    "total_withdrawals": 1200.0,
    "total_fees": 10.0,
    "total_interest": 5.25,
    "net_change": 3500.0,
    "transaction_count": 18,
    "average_daily_balance": 6750.0
  },
  "daily_breakdown": [
    {
      "date": "2026-03-19",
      "opening_balance": 8000.0,
      "closing_balance": 8500.0,
      "deposits": 500.0,
      "withdrawals": 0.0,
      "transaction_count": 1
    }
  ],
  "category_breakdown": {
    "DEPOSIT": {
      "Salary": { "count": 1, "amount": 3500.0 },
      "Bonus": { "count": 1, "amount": 1500.0 }
    },
    "WITHDRAWAL": {
      "Groceries": { "count": 4, "amount": 400.0 },
      "Transport": { "count": 3, "amount": 250.0 }
    }
  }
}
```

**Error Responses:**

- `401` - Unauthorized
- `403` - Account does not belong to current user
- `404` - Account not found

---

## Summary

| Module         | Endpoints | Status                       |
| -------------- | --------- | ---------------------------- |
| Authentication | 3         | Secure JWT                   |
| Users          | 4         | User profile management      |
| Bank Accounts  | 6         | Multi-account support        |
| Transactions   | 6         | Unified transaction tracking |
| Transfers      | 3         | Inter-account transfers      |
| Categories     | 8         | Custom categorization        |
| Reports        | 3         | Comprehensive reporting      |
| **TOTAL**      | **33**    | Fully optimized              |

---

## Updated Relationship Summary

| Endpoint                                  | Method              | Purpose                 |
| ----------------------------------------- | ------------------- | ----------------------- |
| `/api/v1/auth/login`                      | POST                | User authentication     |
| `/api/v1/auth/refresh`                    | POST                | Token refresh           |
| `/api/v1/auth/logout`                     | POST                | Session termination     |
| `/api/v1/users/me`                        | GET                 | Current user profile    |
| `/api/v1/bank-accounts`                   | GET/POST            | Account management      |
| `/api/v1/bank-accounts/<id>`              | GET/PUT/DELETE      | Account operations      |
| `/api/v1/bank-accounts/<id>/summary`      | GET                 | Account dashboard       |
| `/api/v1/bank-accounts/<id>/transactions` | GET/POST            | Transaction management  |
| `/api/v1/transfers`                       | GET/POST            | Inter-account transfers |
| `/api/v1/users/income-categories`         | GET/POST/PUT/DELETE | Income categorization   |
| `/api/v1/users/expense-categories`        | GET/POST/PUT/DELETE | Expense categorization  |
| `/api/v1/reports/monthly`                 | GET                 | Monthly reports         |
| `/api/v1/reports/custom`                  | GET                 | Custom date reports     |

---

## Security Measures

✅ **Implemented:**

- JWT token-based authentication
- Authorization checks (users access only their data)
- Secure password hashing (bcrypt)
- Refresh token revocation on logout
- Input validation on all endpoints
- Proper HTTP status codes

⚠️ **To Implement in Production:**

1. Move secret key to environment variables
2. Implement rate limiting
3. Add request logging/monitoring
4. Use HTTPS only
5. Implement CORS properly
6. Add API versioning
7. Consider encryption for sensitive data

---

## Common HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 204  | No Content            |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 500  | Internal Server Error |
