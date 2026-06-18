CREATE TYPE order_status AS ENUM (
    'new', 'paid', 'in_progress', 'review', 'approved', 'completed'
);

CREATE TABLE orders (
    id           BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(20) NOT NULL UNIQUE,
    client_id    BIGINT NOT NULL REFERENCES clients(id),
    manager_id   BIGINT REFERENCES users(id),
    status       order_status NOT NULL DEFAULT 'new',
    price        NUMERIC(10,2) NOT NULL DEFAULT 0,
    deadline     DATE,
    raw_brief    TEXT,
    parsed_by_ai BOOLEAN NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_client_id ON orders(client_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_manager_id ON orders(manager_id);