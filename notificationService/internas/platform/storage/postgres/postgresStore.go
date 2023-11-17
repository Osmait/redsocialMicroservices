package postgres

import (
	"github.com/osmait/notificationservice/internas/platform/domain"
	"gorm.io/gorm"
)

type PostgresStoreRepository struct {
	Conn *gorm.DB
}

func NewPostgresStoreRepository(conn *gorm.DB) *PostgresStoreRepository {
	return &PostgresStoreRepository{Conn: conn}
}

func (p PostgresStoreRepository) Save(notification *domain.Notifcation) {
	p.Conn.Create(notification)
}

func (p PostgresStoreRepository) Find(id string) []domain.Notifcation {
	var notificationList []domain.Notifcation
	p.Conn.Find(&notificationList, "user_id =?", id)
	return notificationList
}
