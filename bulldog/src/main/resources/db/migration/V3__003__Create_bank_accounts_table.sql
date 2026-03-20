CREATE TABLE IF NOT EXISTS bulldog.bank_accounts (
                                                     id BIGSERIAL PRIMARY KEY,
                                                     user_id BIGINT NOT NULL,
                                                     bank_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    routing_number VARCHAR(20) NOT NULL,
    account_type bulldog.account_type NOT NULL,
    alias VARCHAR(100),
    current_balance DECIMAL(15, 2) DEFAULT 0.00,
    initial_balance DECIMAL(15, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                             CONSTRAINT fk_bank_accounts_user_id
                             FOREIGN KEY (user_id)
    REFERENCES bulldog.users(id)
                         ON DELETE CASCADE,
    CONSTRAINT unique_user_account
    UNIQUE(user_id, account_number)
    );

-- Create indices for bank_accounts
CREATE INDEX idx_bank_accounts_user_id ON bulldog.bank_accounts(user_id);
CREATE INDEX idx_bank_accounts_is_active ON bulldog.bank_accounts(is_active);
CREATE INDEX idx_bank_accounts_account_type ON bulldog.bank_accounts(account_type);

-- Partial index for active accounts
CREATE INDEX idx_bank_accounts_active ON bulldog.bank_accounts(user_id)
    WHERE is_active = TRUE;


-- Add comments
COMMENT ON TABLE bulldog.bank_accounts IS 'Bank accounts linked to user accounts';
COMMENT ON COLUMN bulldog.bank_accounts.user_id IS 'Reference to user';
COMMENT ON COLUMN bulldog.bank_accounts.current_balance IS 'Current account balance';
COMMENT ON COLUMN bulldog.bank_accounts.account_number IS 'Bank account number (masked)';
