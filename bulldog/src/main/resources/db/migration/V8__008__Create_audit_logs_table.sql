CREATE TABLE IF NOT EXISTS bulldog.audit_logs (
                                                  id BIGSERIAL PRIMARY KEY,
                                                  user_id BIGINT,
                                                  action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                             CONSTRAINT fk_audit_logs_user_id
                             FOREIGN KEY (user_id)
    REFERENCES bulldog.users(id)
                         ON DELETE SET NULL
    );

-- Create indices
CREATE INDEX idx_audit_logs_user_id ON bulldog.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON bulldog.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_entity ON bulldog.audit_logs(entity_type, entity_id);

-- JSONB indices for better query performance
CREATE INDEX idx_audit_logs_old_values ON bulldog.audit_logs USING GIN(old_values);
CREATE INDEX idx_audit_logs_new_values ON bulldog.audit_logs USING GIN(new_values);

-- Add comments
COMMENT ON TABLE bulldog.audit_logs IS 'Audit trail for all entity changes';
COMMENT ON COLUMN bulldog.audit_logs.old_values IS 'Previous values in JSONB format';
COMMENT ON COLUMN bulldog.audit_logs.new_values IS 'New values in JSONB format';
