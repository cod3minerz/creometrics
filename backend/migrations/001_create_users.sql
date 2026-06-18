CREATE TYPE user_role AS ENUM ('admin', 'manager', 'designer', 'client');
CREATE TYPE user_status AS ENUM ('active', 'invited', 'disabled');

CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    name          VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    role          user_role NOT NULL,
    status        user_status NOT NULL DEFAULT 'invited',
    avatar_url    VARCHAR(500),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);