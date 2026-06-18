package main

import (
	"log"

	"creometrics/internal/config"
	"creometrics/internal/db"

	"github.com/gofiber/fiber/v2"
)

func main() {
    cfg := config.Load()

    pool, err := db.Connect(cfg)
    if err != nil {
        log.Fatal(err)
    }
    defer pool.Close()

    app := fiber.New()

    app.Get("/health", func(c *fiber.Ctx) error {
        return c.JSON(fiber.Map{"status": "ok"})
    })

    log.Fatal(app.Listen(":" + cfg.AppPort))
}