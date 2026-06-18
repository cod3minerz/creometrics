CREATE TYPE subtask_status AS ENUM (
    'pending', 'in_progress', 'review', 'revision', 'completed'
);

CREATE TYPE creative_type AS ENUM ('static', 'video', 'landing');

CREATE TABLE subtasks (
    id             BIGSERIAL PRIMARY KEY,
    order_id       BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    sequence_num   SMALLINT NOT NULL,
    creative_type  creative_type NOT NULL DEFAULT 'static',
    brief_text     TEXT,
    status         subtask_status NOT NULL DEFAULT 'pending',
    assigned_to    BIGINT REFERENCES users(id),
    started_at     TIMESTAMPTZ,
    completed_at   TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(order_id, sequence_num)
);

CREATE INDEX idx_subtasks_order_id ON subtasks(order_id);
CREATE INDEX idx_subtasks_assigned_to ON subtasks(assigned_to);
CREATE INDEX idx_subtasks_status ON subtasks(status);