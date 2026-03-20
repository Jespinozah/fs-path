CREATE TABLE IF NOT EXISTS bulldog.transactions (
                                                    id BIGSERIAL PRIMARY KEY,
                                                    bank_account_id BIGINT NOT NULL,
                                                    user_id BIGINT NOT NULL,
                                                    transaction_type bulldog.transaction_type NOT NULL,
                                                    amount DECIMAL(15, 2) NOT NULL,
    category VARCHAR(100),
    description VARCHAR(255),
    reference_number VARCHAR(100),
    transaction_date DATE NOT NULL,
    transaction_time TIME,
    status bulldog.transaction_status DEFAULT 'COMPLETED',
    notes VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                             CONSTRAINT fk_transactions_bank_account_id
                             FOREIGN KEY (bank_account_id)
    REFERENCES bulldog.bank_accounts(id)
                         ON DELETE CASCADE,
    CONSTRAINT fk_transactions_user_id
    FOREIGN KEY (user_id)
    REFERENCES bulldog.users(id)
                         ON DELETE CASCADE,
    CONSTRAINT ck_positive_amount
    CHECK (amount > 0)
    );

-- Create indices for transactions
CREATE INDEX idx_transactions_bank_account_id ON bulldog.transactions(bank_account_id);
CREATE INDEX idx_transactions_user_id ON bulldog.transactions(user_id);
CREATE INDEX idx_transactions_transaction_date ON bulldog.transactions(transaction_date DESC);
CREATE INDEX idx_transactions_transaction_type ON bulldog.transactions(transaction_type);
CREATE INDEX idx_transactions_status ON bulldog.transactions(status);
CREATE INDEX idx_transactions_created_at ON bulldog.transactions(created_at DESC);

-- Composite indices for common queries
CREATE INDEX idx_transactions_account_date ON bulldog.transactions(
                                                                   bank_account_id,
                                                                   transaction_date DESC,
                                                                   status
    );

CREATE INDEX idx_transactions_user_date ON bulldog.transactions(
                                                                user_id,
                                                                transaction_date DESC
    );

-- Partial index for completed transactions
CREATE INDEX idx_transactions_completed ON bulldog.transactions(bank_account_id)
    WHERE status = 'COMPLETED';


-- Add comments
COMMENT ON TABLE bulldog.transactions IS 'Financial transactions for bank accounts';
COMMENT ON COLUMN bulldog.transactions.amount IS 'Transaction amount (always positive)';
COMMENT ON COLUMN bulldog.transactions.transaction_date IS 'Date of transaction';
COMMENT ON COLUMN bulldog.transactions.status IS 'Transaction status (PENDING, COMPLETED, FAILED, CANCELLED)';
