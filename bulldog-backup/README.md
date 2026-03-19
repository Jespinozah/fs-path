# Bulldog API

Bulldog is a Python-based RESTful API built with Flask. It provides endpoints for user management, authentication, and expense tracking.

## Prerequisites

- Python 3.8 or higher
- PostgreSQL
- Docker (optional, for running PostgreSQL using Docker)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bulldog
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up the PostgreSQL database:
   - Create a database named `db`.
   - Update the database connection string in `database.py` if necessary.

5. Run database migrations:
   ```bash
   python -c "from database import db, init_db; from app import app; init_db(app)"
   ```

## Running the Application

### Using Flask (Development)
1. Start the Flask application:
   ```bash
   python app.py
   ```

2. Access the API documentation:
   - Swagger UI: [http://localhost:8080/apidocs/](http://localhost:8080/apidocs/)

### Using Gunicorn (Production)
1. Start the application with Gunicorn:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:8080 app:app
   ```
   - `-w 4`: Specifies the number of worker processes (adjust based on your server's resources).
   - `-b 0.0.0.0:8080`: Binds the application to all network interfaces on port 8080.

2. Access the API documentation:
   - Swagger UI: [http://localhost:8080/apidocs/](http://localhost:8080/apidocs/)

## Endpoints

### Users

- **Create User**  
  `POST /api/v1/users/`  
  Request Body:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 30,
    "password": "password123"
  }
  ```

- **Get All Users**  
  `GET /api/v1/users/`

- **Get User by ID**  
  `GET /api/v1/users/<user_id>`

- **Update User**  
  `PUT /api/v1/users/<user_id>`  
  Request Body:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 31,
    "password": "newpassword123"
  }
  ```

- **Delete User**  
  `DELETE /api/v1/users/<user_id>`

### Authentication

- **Login**  
  `POST /api/v1/auth/login`  
  Request Body:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

- **Refresh Token**  
  `POST /api/v1/auth/refresh`

- **Logout**  
  `POST /api/v1/auth/logout`

### Expenses

- **Create Expense**  
  `POST /api/v1/expenses/`  
  Request Body:
  ```json
  {
    "user_id": 1,
    "amount": 100.50,
    "category": "Food",
    "date": "2023-10-01",
    "description": "Dinner at a restaurant"
  }
  ```

- **Get All Expenses**  
  `GET /api/v1/expenses/`

- **Get Expense by ID**  
  `GET /api/v1/expenses/<expense_id>`

- **Update Expense**  
  `PUT /api/v1/expenses/<expense_id>`  
  Request Body:
  ```json
  {
    "user_id": 1,
    "amount": 120.00,
    "category": "Food",
    "date": "2023-10-02",
    "description": "Updated dinner expense"
  }
  ```

- **Delete Expense**  
  `DELETE /api/v1/expenses/<expense_id>`

- **Get Expenses by User ID**  
  `GET /api/v1/expenses/user/<user_id>`

## Running with Docker (Optional)

1. Start the PostgreSQL database and pgAdmin using Docker:
   ```bash
   docker-compose up -d
   ```

2. Follow the steps in the "Running the Application" section to start the Flask application.

## License

This project is licensed under the MIT License.
