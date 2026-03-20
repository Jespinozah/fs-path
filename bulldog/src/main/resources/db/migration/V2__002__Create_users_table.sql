CREATE TABLE IF NOT EXISTS bulldog.users (
                                             id BIGSERIAL PRIMARY KEY,
                                             name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INTEGER,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                             );

-- Create indices for users
CREATE INDEX idx_users_email ON bulldog.users(email);
CREATE INDEX idx_users_is_active ON bulldog.users(is_active);


-- Add comments
COMMENT ON TABLE bulldog.users IS 'Stores user account information';
COMMENT ON COLUMN bulldog.users.id IS 'Unique identifier for user';
COMMENT ON COLUMN bulldog.users.email IS 'User email address (unique)';
COMMENT ON COLUMN bulldog.users.password IS 'Hashed password';
COMMENT ON COLUMN bulldog.users.is_active IS 'Whether user account is active';
