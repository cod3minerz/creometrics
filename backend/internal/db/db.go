package db

import (
	"context"
	"fmt"

	"creometrics/internal/config"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Connect(cfg *config.Config) (*pgxpool.Pool, error) {
    connStr := fmt.Sprintf(
        "host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
        cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPass, cfg.DBName, cfg.DBSSLMode,
    )

    pool, err := pgxpool.New(context.Background(), connStr)
    if err != nil {
        return nil, fmt.Errorf("unable to connect to database: %w", err)
    }

    if err := pool.Ping(context.Background()); err != nil {
        return nil, fmt.Errorf("database is unreachable: %w", err)
    }

    return pool, nil
}