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
)