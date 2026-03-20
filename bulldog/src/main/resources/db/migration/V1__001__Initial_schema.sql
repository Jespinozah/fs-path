-- Create UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schema
CREATE SCHEMA IF NOT EXISTS bulldog;

-- Set default schema
SET search_path TO bulldog, public;

-- Create ENUM types
CREATE TYPE bulldog.transaction_type AS ENUM (
    'DEPOSIT',
    'WITHDRAWAL',
    'TRANSFER_OUT',
    'TRANSFER_IN',
    'FEE',
    'INTEREST'
);

CREATE TYPE bulldog.transaction_status AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'CANCELLED'
);

CREATE TYPE bulldog.transfer_status AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED'
);

CREATE TYPE bulldog.account_type AS ENUM (
    'Checking',
    'Savings',
    'Money Market',
    'IRA',
    'Credit Card'
);
