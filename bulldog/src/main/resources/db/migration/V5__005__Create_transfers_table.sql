CREATE TABLE IF NOT EXISTS bulldog.transfers (
                                                 id BIGSERIAL PRIMARY KEY,
                                                 user_id BIGINT NOT NULL,
                                                 from_bank_account_id BIGINT NOT NULL,
                                                 to_bank_account_id BIGINT NOT NULL,
                                                 amount DECIMAL(15, 2) NOT NULL,
    transfer_date DATE NOT NULL,
    from_transaction_id BIGINT,
    to_transaction_id BIGINT,
    description VARCHAR(255),
    status bulldog.transfer_status DEFAULT 'COMPLETED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                             CONSTRAINT fk_transfers_user_id
                             FOREIGN KEY (user_id)
    REFERENCES bulldog.users(id)
                         ON DELETE CASCADE,
    CONSTRAINT fk_transfers_from_account_id
    FOREIGN KEY (from_bank_account_id)
    REFERENCES bulldog.bank_accounts(id)
                         ON DELETE CASCADE,
    CONSTRAINT fk_transfers_to_account_id
    FOREIGN KEY (to_bank_account_id)
    REFERENCES bulldog.bank_accounts(id)
                         ON DELETE CASCADE,
    CONSTRAINT fk_transfers_from_transaction_id
    FOREIGN KEY (from_transaction_id)
    REFERENCES bulldog.transactions(id)
                         ON DELETE SET NULL,
    CONSTRAINT fk_transfers_to_transaction_id
    FOREIGN KEY (to_transaction_id)
    REFERENCES bulldog.transactions(id)
                         ON DELETE SET NULL,
    CONSTRAINT ck_different_accounts
    CHECK (from_bank_account_id != to_bank_account_id),
    CONSTRAINT ck_positive_transfer_amount
    CHECK (amount > 0)
    );

-- Create indices for transfers
CREATE INDEX idx_transfers_user_id ON bulldog.transfers(user_id);
CREATE INDEX idx_transfers_from_account ON bulldog.transfers(from_bank_account_id);
CREATE INDEX idx_transfers_to_account ON bulldog.transfers(to_bank_account_id);
CREATE INDEX idx_transfers_transfer_date ON bulldog.transfers(transfer_date DESC);
CREATE INDEX idx_transfers_status ON bulldog.transfers(status);


-- Add comments
COMMENT ON TABLE bulldog.transfers IS 'Transfer records between user bank accounts';
COMMENT ON COLUMN bulldog.transfers.amount IS 'Transfer amount (always positive)';
