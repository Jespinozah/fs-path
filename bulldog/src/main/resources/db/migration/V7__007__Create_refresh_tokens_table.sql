CREATE TABLE IF NOT EXISTS bulldog.refresh_tokens (
                                                      id BIGSERIAL PRIMARY KEY,
                                                      user_id BIGINT NOT NULL,
                                                      token TEXT NOT NULL,
                                                      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                                                      is_revoked BOOLEAN DEFAULT FALSE,
                                                      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                                      CONSTRAINT fk_refresh_tokens_user_id
                                                      FOREIGN KEY (user_id)
    REFERENCES bulldog.users(id)
    ON DELETE CASCADE,
    CONSTRAINT unique_refresh_token
    UNIQUE(token)
    );

-- Create indices
CREATE INDEX idx_refresh_tokens_user_id ON bulldog.refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON bulldog.refresh_tokens(expires_at);

-- Partial index for non-revoked tokens
CREATE INDEX idx_refresh_tokens_active ON bulldog.refresh_tokens(user_id)
    WHERE is_revoked = FALSE;

-- Add comments
COMMENT ON TABLE bulldog.refresh_tokens IS 'JWT refresh tokens for session management';
COMMENT ON COLUMN bulldog.refresh_tokens.is_revoked IS 'Whether token has been revoked';
