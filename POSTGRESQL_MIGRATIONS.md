# PostgreSQL Flyway Migration Scripts

**Database:** PostgreSQL 15+  
**Migration Tool:** Flyway  
**Directory:** `src/main/resources/db/migration`

---

## Migration Files Structure

```
src/main/resources/db/migration/
├── V1__001__Initial_schema.sql
├── V2__002__Create_users_table.sql
├── V3__003__Create_bank_accounts_table.sql
├── V4__004__Create_transactions_table.sql
├── V5__005__Create_transfers_table.sql
├── V6__006__Create_categories_tables.sql
├── V7__007__Create_monthly_summaries_table.sql
├── V8__008__Create_indices.sql
├── V9__009__Create_refresh_tokens_table.sql
├── V10__010__Create_audit_logs_table.sql
└── V11__011__Create_functions_and_triggers.sql
```

---

## V1**001**Initial_schema.sql

```sql
-- filepath: src/main/resources/db/migration/V1__001__Initial_schema.sql

-- Create UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE transaction_type AS ENUM (
    'DEPOSIT',
    'WITHDRAWAL',
    'TRANSFER_OUT',
    'TRANSFER_IN',
    'FEE',
    'INTEREST'
);

CREATE TYPE transaction_status AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'CANCELLED'
);

CREATE TYPE transfer_status AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED'
);

CREATE TYPE account_type AS ENUM (
    'Checking',
    'Savings',
    'Money Market',
    'IRA',
    'Credit Card'
);

-- Create schema
CREATE SCHEMA IF NOT EXISTS bulldog;

-- Set default schema
SET search_path TO bulldog, public;
```

---

## V2**002**Create_users_table.sql

```sql
-- filepath: src/main/resources/db/migration/V2__002__Create_users_table.sql

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

-- Create audit trigger for users table
CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON bulldog.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE bulldog.users IS 'Stores user account information';
COMMENT ON COLUMN bulldog.users.id IS 'Unique identifier for user';
COMMENT ON COLUMN bulldog.users.email IS 'User email address (unique)';
COMMENT ON COLUMN bulldog.users.password IS 'Hashed password';
COMMENT ON COLUMN bulldog.users.is_active IS 'Whether user account is active';
```

---

## V3**003**Create_bank_accounts_table.sql

```sql
-- filepath: src/main/resources/db/migration/V3__003__Create_bank_accounts_table.sql

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

-- Update trigger
CREATE TRIGGER bank_accounts_updated_at
    BEFORE UPDATE ON bulldog.bank_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE bulldog.bank_accounts IS 'Bank accounts linked to user accounts';
COMMENT ON COLUMN bulldog.bank_accounts.user_id IS 'Reference to user';
COMMENT ON COLUMN bulldog.bank_accounts.current_balance IS 'Current account balance';
COMMENT ON COLUMN bulldog.bank_accounts.account_number IS 'Bank account number (masked)';
```

---

## V4**004**Create_transactions_table.sql

```sql
-- filepath: src/main/resources/db/migration/V4__004__Create_transactions_table.sql

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

-- Update trigger
CREATE TRIGGER transactions_updated_at
    BEFORE UPDATE ON bulldog.transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE bulldog.transactions IS 'Financial transactions for bank accounts';
COMMENT ON COLUMN bulldog.transactions.amount IS 'Transaction amount (always positive)';
COMMENT ON COLUMN bulldog.transactions.transaction_date IS 'Date of transaction';
COMMENT ON COLUMN bulldog.transactions.status IS 'Transaction status (PENDING, COMPLETED, FAILED, CANCELLED)';
```

---

## V5**005**Create_transfers_table.sql

```sql
-- filepath: src/main/resources/db/migration/V5__005__Create_transfers_table.sql

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

-- Update trigger
CREATE TRIGGER transfers_updated_at
    BEFORE UPDATE ON bulldog.transfers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE bulldog.transfers IS 'Transfer records between user bank accounts';
COMMENT ON COLUMN bulldog.transfers.amount IS 'Transfer amount (always positive)';
```

---

## V6**006**Create_categories_tables.sql

```sql
-- filepath: src/main/resources/db/migration/V6__006__Create_categories_tables.sql

CREATE TABLE IF NOT EXISTS bulldog.income_categories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    category_name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(7),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_income_categories_user_id
        FOREIGN KEY (user_id)
        REFERENCES bulldog.users(id)
        ON DELETE CASCADE,
    CONSTRAINT unique_income_category
        UNIQUE(user_id, category_name)
);

CREATE TABLE IF NOT EXISTS bulldog.expense_categories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    category_name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(7),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_expense_categories_user_id
        FOREIGN KEY (user_id)
        REFERENCES bulldog.users(id)
        ON DELETE CASCADE,
    CONSTRAINT unique_expense_category
        UNIQUE(user_id, category_name)
);

-- Create indices
CREATE INDEX idx_income_categories_user_id ON bulldog.income_categories(user_id);
CREATE INDEX idx_income_categories_is_active ON bulldog.income_categories(is_active);
CREATE INDEX idx_expense_categories_user_id ON bulldog.expense_categories(user_id);
CREATE INDEX idx_expense_categories_is_active ON bulldog.expense_categories(is_active);

-- Add comments
COMMENT ON TABLE bulldog.income_categories IS 'User-defined income categories';
COMMENT ON TABLE bulldog.expense_categories IS 'User-defined expense categories';
```

---

## V7**007**Create_monthly_summaries_table.sql

```sql
-- filepath: src/main/resources/db/migration/V7__007__Create_monthly_summaries_table.sql

CREATE TABLE IF NOT EXISTS bulldog.monthly_summaries (
    id BIGSERIAL PRIMARY KEY,
    bank_account_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    total_deposits DECIMAL(15, 2) DEFAULT 0.00,
    total_withdrawals DECIMAL(15, 2) DEFAULT 0.00,
    total_fees DECIMAL(15, 2) DEFAULT 0.00,
    total_interest DECIMAL(15, 2) DEFAULT 0.00,
    opening_balance DECIMAL(15, 2),
    closing_balance DECIMAL(15, 2),
    transaction_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_monthly_summaries_bank_account
        FOREIGN KEY (bank_account_id)
        REFERENCES bulldog.bank_accounts(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_monthly_summaries_user_id
        FOREIGN KEY (user_id)
        REFERENCES bulldog.users(id)
        ON DELETE CASCADE,
    CONSTRAINT unique_monthly_summary
        UNIQUE(bank_account_id, year, month),
    CONSTRAINT ck_valid_month
        CHECK (month >= 1 AND month <= 12),
    CONSTRAINT ck_valid_year
        CHECK (year >= 2000)
);

-- Create indices
CREATE INDEX idx_monthly_summaries_bank_account ON bulldog.monthly_summaries(bank_account_id);
CREATE INDEX idx_monthly_summaries_user_id ON bulldog.monthly_summaries(user_id);
CREATE INDEX idx_monthly_summaries_year_month ON bulldog.monthly_summaries(year, month DESC);

-- Update trigger
CREATE TRIGGER monthly_summaries_updated_at
    BEFORE UPDATE ON bulldog.monthly_summaries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE bulldog.monthly_summaries IS 'Pre-calculated monthly account summaries for fast reporting';
```

---

## V8**008**Create_refresh_tokens_table.sql

```sql
-- filepath: src/main/resources/db/migration/V8__008__Create_refresh_tokens_table.sql

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
```

---

## V9**009**Create_audit_logs_table.sql

```sql
-- filepath: src/main/resources/db/migration/V9__009__Create_audit_logs_table.sql

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
```

---

## V10**010**Create_functions_and_triggers.sql

```sql
-- filepath: src/main/resources/db/migration/V10__010__Create_functions_and_triggers.sql

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION bulldog.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate account balance
CREATE OR REPLACE FUNCTION bulldog.calculate_account_balance(p_account_id BIGINT)
RETURNS DECIMAL AS $$
DECLARE
    v_balance DECIMAL(15, 2);
BEGIN
    SELECT COALESCE(ba.initial_balance, 0) +
           COALESCE(SUM(
               CASE
                   WHEN t.transaction_type IN ('DEPOSIT', 'TRANSFER_IN', 'INTEREST')
                   THEN t.amount
                   WHEN t.transaction_type IN ('WITHDRAWAL', 'TRANSFER_OUT', 'FEE')
                   THEN -t.amount
                   ELSE 0
               END
           ), 0)
    INTO v_balance
    FROM bulldog.bank_accounts ba
    LEFT JOIN bulldog.transactions t ON ba.id = t.bank_account_id
        AND t.status = 'COMPLETED'
        AND t.created_at <= NOW()
    WHERE ba.id = p_account_id
    GROUP BY ba.id, ba.initial_balance;

    RETURN COALESCE(v_balance, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to update monthly summaries
CREATE OR REPLACE FUNCTION bulldog.update_monthly_summary()
RETURNS TRIGGER AS $$
DECLARE
    v_year INTEGER;
    v_month INTEGER;
    v_summary_exists BOOLEAN;
BEGIN
    v_year := EXTRACT(YEAR FROM NEW.transaction_date)::INTEGER;
    v_month := EXTRACT(MONTH FROM NEW.transaction_date)::INTEGER;

    SELECT EXISTS(
        SELECT 1 FROM bulldog.monthly_summaries
        WHERE bank_account_id = NEW.bank_account_id
        AND year = v_year
        AND month = v_month
    ) INTO v_summary_exists;

    IF v_summary_exists THEN
        UPDATE bulldog.monthly_summaries
        SET
            total_deposits = COALESCE(total_deposits, 0) +
                CASE
                    WHEN NEW.transaction_type IN ('DEPOSIT', 'TRANSFER_IN', 'INTEREST')
                    AND NEW.status = 'COMPLETED'
                    THEN NEW.amount
                    ELSE 0
                END,
            total_withdrawals = COALESCE(total_withdrawals, 0) +
                CASE
                    WHEN NEW.transaction_type IN ('WITHDRAWAL', 'TRANSFER_OUT')
                    AND NEW.status = 'COMPLETED'
                    THEN NEW.amount
                    ELSE 0
                END,
            total_fees = COALESCE(total_fees, 0) +
                CASE
                    WHEN NEW.transaction_type = 'FEE'
                    AND NEW.status = 'COMPLETED'
                    THEN NEW.amount
                    ELSE 0
                END,
            total_interest = COALESCE(total_interest, 0) +
                CASE
                    WHEN NEW.transaction_type = 'INTEREST'
                    AND NEW.status = 'COMPLETED'
                    THEN NEW.amount
                    ELSE 0
                END,
            transaction_count = transaction_count + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE bank_account_id = NEW.bank_account_id
        AND year = v_year
        AND month = v_month;
    ELSE
        INSERT INTO bulldog.monthly_summaries (
            bank_account_id, user_id, year, month, transaction_count, created_at, updated_at
        )
        VALUES (
            NEW.bank_account_id, NEW.user_id, v_year, v_month, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call update_monthly_summary on transaction insert
CREATE TRIGGER transactions_monthly_summary
    AFTER INSERT ON bulldog.transactions
    FOR EACH ROW
    EXECUTE FUNCTION bulldog.update_monthly_summary();

-- Add comments
COMMENT ON FUNCTION bulldog.update_updated_at_column() IS 'Automatically updates updated_at column to current timestamp';
COMMENT ON FUNCTION bulldog.calculate_account_balance(BIGINT) IS 'Calculates current balance for a bank account';
COMMENT ON FUNCTION bulldog.update_monthly_summary() IS 'Updates monthly summaries when transactions are created';
```

---

## V11**011**Seed_default_categories.sql

```sql
-- filepath: src/main/resources/db/migration/V11__011__Seed_default_categories.sql

-- This migration is optional - you can seed default categories here
-- Uncomment if you want default categories or remove if users define their own

/*
-- Default Income Categories (system-wide, not user-specific)
INSERT INTO bulldog.income_categories (category_name, icon, color, is_active) VALUES
    ('Salary', 'briefcase', '#4CAF50', TRUE),
    ('Bonus', 'gift', '#FF9800', TRUE),
    ('Freelance Work', 'laptop', '#2196F3', TRUE),
    ('Investments', 'trending-up', '#8BC34A', TRUE),
    ('Refunds', 'undo', '#00BCD4', TRUE),
    ('Other Income', 'more-horizontal', '#757575', TRUE)
ON CONFLICT (category_name) DO NOTHING;

-- Default Expense Categories (system-wide, not user-specific)
INSERT INTO bulldog.expense_categories (category_name, icon, color, is_active) VALUES
    ('Groceries', 'shopping-cart', '#FF5722', TRUE),
    ('Transportation', 'car', '#2196F3', TRUE),
    ('Entertainment', 'film', '#9C27B0', TRUE),
    ('Dining Out', 'utensils', '#E91E63', TRUE),
    ('Utilities', 'zap', '#FFC107', TRUE),
    ('Healthcare', 'heart', '#F44336', TRUE),
    ('Shopping', 'shopping-bag', '#FF1493', TRUE),
    ('Subscriptions', 'repeat', '#00BCD4', TRUE),
    ('Insurance', 'shield', '#607D8B', TRUE),
    ('Other Expenses', 'more-horizontal', '#757575', TRUE)
ON CONFLICT (category_name) DO NOTHING;
*/
```

---

## Updated application.yml for PostgreSQL

```yaml
# filepath: src/main/resources/application.yml

spring:
  application:
    name: bulldog-api
    version: 1.0.0

  # DataSource Configuration for PostgreSQL
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:bulldog_db}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:password}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 20000
      idle-timeout: 300000
      max-lifetime: 1200000
      auto-commit: true
      connection-test-query: SELECT 1

  # JPA/Hibernate Configuration for PostgreSQL
  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        use_sql_comments: true
        jdbc:
          batch_size: 20
          fetch_size: 50
          batch_versioned_data: true
        order_inserts: true
        order_updates: true
        dialect: org.hibernate.dialect.PostgreSQLDialect
        enable_lazy_load_no_trans: true
        default_batch_fetch_size: 20
        # PostgreSQL specific settings
        generate_statistics: true

  # Flyway Database Migration
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
    out-of-order: false
    schemas: bulldog

  # Cache Configuration (Redis)
  cache:
    type: redis
    redis:
      time-to-live: 600000

  redis:
    host: ${REDIS_HOST:localhost}
    port: ${REDIS_PORT:6379}
    timeout: 5000
    password: ${REDIS_PASSWORD:}
    jedis:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0
        max-wait: -1ms

  jackson:
    default-property-inclusion: non_null
    serialization:
      write-dates-as-timestamps: false
      indent-output: true
    deserialization:
      fail-on-unknown-properties: false

server:
  servlet:
    context-path: /api
  port: 8080
  shutdown: graceful
  compression:
    enabled: true
    min-response-size: 1024

logging:
  level:
    root: INFO
    com.bulldog: DEBUG
    org.springframework.web: INFO
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"
    file: "%d %p %c{1.} [%t] %m%n"
  file:
    name: logs/bulldog.log
    max-size: 10MB
    max-history: 30

management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus,info
      base-path: /actuator
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true

springdoc:
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
    show-common-extensions: true
  api-docs:
    path: /v3/api-docs
  use-fqn: true

app:
  jwt:
    secret: ${JWT_SECRET:your-secret-key-change-in-production}
    expiration: 900000 # 15 minutes
    refresh-expiration: 604800000 # 7 days
    header: Authorization
    prefix: Bearer

  api:
    version: v1
    base-path: /api/v1
  cors:
    allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:3000}
    allowed-methods: GET,POST,PUT,DELETE,OPTIONS
    allowed-headers: "*"
    allow-credentials: true
    max-age: 3600
```

---

## Updated pom.xml Dependencies for PostgreSQL

```xml
<!-- Add PostgreSQL driver instead of MySQL -->

<!-- Remove this:
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.2.0</version>
    <scope>runtime</scope>
</dependency>
-->

<!-- Add this instead:
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.7.1</version>
    <scope>runtime</scope>
</dependency>
-->

<!-- Update Flyway dependency:
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
    <version>9.22.3</version>
</dependency>

<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-postgres</artifactId>
    <version>9.22.3</version>
</dependency>
-->
```

---

## Updated docker-compose.yml for PostgreSQL

```yaml
# filepath: docker-compose.yml

version: "3.9"

services:
  postgres:
    image: postgres:15-alpine
    container_name: bulldog-postgres
    environment:
      POSTGRES_DB: bulldog_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_INITDB_ARGS: "--encoding=UTF8 --locale=en_US.UTF-8"
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - bulldog-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      timeout: 10s
      retries: 5
      start_period: 40s
    restart: unless-stopped

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: bulldog-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@bulldog.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres
    networks:
      - bulldog-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: bulldog-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - bulldog-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      timeout: 5s
      retries: 10
    restart: unless-stopped

  bulldog-api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: bulldog-api
    ports:
      - "8080:8080"
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: bulldog_db
      DB_USERNAME: postgres
      DB_PASSWORD: password
      REDIS_HOST: redis
      REDIS_PORT: 6379
      JWT_SECRET: ${JWT_SECRET:-your-secret-key-change-in-production}
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE:-dev}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - bulldog-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/actuator/health"]
      timeout: 10s
      retries: 5
      start_period: 30s

networks:
  bulldog-network:
    driver: bridge

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
```

---

## PostgreSQL Performance Tips

### 1. Vacuum and Analyze

```sql
-- Run periodically to maintain performance
VACUUM ANALYZE bulldog.transactions;
VACUUM ANALYZE bulldog.bank_accounts;
ANALYZE bulldog.transactions;
```

### 2. Create Partitioning (Optional for large datasets)

```sql
-- Partition transactions table by year/month for huge datasets
CREATE TABLE bulldog.transactions_2026_03 PARTITION OF bulldog.transactions
    FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
```

### 3. Connection Pooling Configuration

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 20000
      validation-interval: 30000
      leak-detection-threshold: 60000
```

---

## Backup Strategy for PostgreSQL

### Automated Backup Script

```bash
#!/bin/bash
# backup-postgres.sh

BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="bulldog_db"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

mkdir -p $BACKUP_DIR

# Full backup
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F c -b -v -f $BACKUP_DIR/full_backup_$DATE.dump

# Compress backup
gzip $BACKUP_DIR/full_backup_$DATE.dump

# Keep only last 30 days
find $BACKUP_DIR -name "*.dump.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/full_backup_$DATE.dump.gz"
```

---

## Summary: MySQL vs PostgreSQL Differences

| Feature                     | MySQL         | PostgreSQL                |
| --------------------------- | ------------- | ------------------------- |
| **ENUM Types**              | Simple to use | Managed as database types |
| **JSON Support**            | JSON (basic)  | JSONB (advanced)          |
| **Window Functions**        | Supported     | Better support            |
| **Triggers**                | Limited       | Full-featured             |
| **Performance (Analytics)** | Good          | Excellent                 |
| **Backup/Recovery**         | mysqldump     | pg_dump                   |
| **Connection Pooling**      | HikariCP      | Better with PgBouncer     |
| **Indexing**                | B-tree        | B-tree, GiST, GIN, BRIN   |

---

## Migration Checklist

- [x] V1: Create schema and ENUMs
- [x] V2: Create users table
- [x] V3: Create bank_accounts table
- [x] V4: Create transactions table
- [x] V5: Create transfers table
- [x] V6: Create categories tables
- [x] V7: Create monthly_summaries table
- [x] V8: Create refresh_tokens table
- [x] V9: Create audit_logs table
- [x] V10: Create functions and triggers
- [x] V11: Seed default categories (optional)

---

## Quick Start with PostgreSQL

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Check services
docker-compose ps

# View PostgreSQL logs
docker-compose logs postgres

# Access pgAdmin
# http://localhost:5050
# Email: admin@bulldog.com
# Password: admin

# Connect to PostgreSQL
# Host: postgres
# Username: postgres
# Password: password
# Database: bulldog_db

# View API
# http://localhost:8080/api/swagger-ui.html
```

This setup is production-ready for PostgreSQL! 🚀
