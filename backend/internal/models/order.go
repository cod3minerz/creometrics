package models

import "time"

type OrderStatus string

const (
    OrderStatusNew        OrderStatus = "new"
    OrderStatusPaid       OrderStatus = "paid"
    OrderStatusInProgress OrderStatus = "in_progress"
    OrderStatusReview     OrderStatus = "review"
    OrderStatusApproved   OrderStatus = "approved"
    OrderStatusCompleted  OrderStatus = "completed"
)

type Order struct {
    ID          int64       `db:"id"           json:"id"`
    OrderNumber string      `db:"order_number" json:"order_number"`
    ClientID    int64       `db:"client_id"    json:"client_id"`
    ManagerID   *int64      `db:"manager_id"   json:"manager_id"`
    Status      OrderStatus `db:"status"       json:"status"`
    Price       float64     `db:"price"        json:"price"`
    Deadline    *time.Time  `db:"deadline"     json:"deadline"`
    RawBrief    *string     `db:"raw_brief"    json:"raw_brief"`
    ParsedByAI  bool        `db:"parsed_by_ai" json:"parsed_by_ai"`
    CreatedAt   time.Time   `db:"created_at"   json:"created_at"`
    UpdatedAt   time.Time   `db:"updated_at"   json:"updated_at"`
}