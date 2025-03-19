package api

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"gradehub/services/user"
)

type API struct {
	addr string
	DB   *sql.DB
}

func NewAPI(addr string, db *sql.DB) *API {
	return &API{
		addr: addr,
		DB:   db,
	}
}

func (a *API) Run() error {
	router := gin.Default()
	subrouter := router.Group("/api/v1")

	userHandler := user.NewHandler()
	userHandler.RegisterRoutes(subrouter)

	return router.Run(a.addr)
}
