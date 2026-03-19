CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    age INT,
    password VARCHAR(250)
);

CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    type VARCHAR(100)
);

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE expenses ADD COLUMN hour TIME;

UPDATE expenses SET hour = '00:00:00' WHERE hour IS NULL;

ALTER TABLE expenses ALTER COLUMN hour SET NOT NULL;


create table bank_accounts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    bank_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(50) NOT NULL UNIQUE,
    routing_number VARCHAR(50) NOT NULL UNIQUE,
    account_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    alias VARCHAR(100),
    balance NUMERIC(10, 2) DEFAULT 0.00
);

ALTER TABLE expenses
ADD COLUMN bank_account_id INTEGER;

alter table expenses
drop column user_id;