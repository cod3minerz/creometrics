CREATE TABLE clients (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    niche         VARCHAR(100),
    balance       NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_by    BIGINT REFERENCES users(id),
    is_vip        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);