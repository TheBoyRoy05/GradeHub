package api

import (
	"database/sql"
	"gradehub/services/user"
	"gradehub/utils"

	"github.com/gin-gonic/gin"
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

func (api *API) Run() error {
	if (utils.GetEnv("GIN_MODE", "debug") == "release") {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()
	router.SetTrustedProxies(nil)
	subrouter := router.Group("/api/v1")

	userStore := user.NewStore(api.DB)
	userHandler := user.NewHandler(userStore)
	userHandler.RegisterRoutes(subrouter)

	return router.Run(api.addr)
}
