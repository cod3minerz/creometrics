package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	AppPort string
	DBHost  string
  DBPort  string
  DBUser  string
  DBPass  string
  DBName  string
  DBSSLMode string
}

func Load() *Config {
	godotenv.Load()

	return &Config {
		AppPort:   os.Getenv("APP_PORT"),
    DBHost:    os.Getenv("DB_HOST"),
    DBPort:    os.Getenv("DB_PORT"),
    DBUser:    os.Getenv("DB_USER"),
    DBPass:    os.Getenv("DB_PASSWORD"),
    DBName:    os.Getenv("DB_NAME"),
    DBSSLMode: os.Getenv("DB_SSLMODE"),
	}
}