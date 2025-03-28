package api

import (
	"database/sql"

	"github.com/gin-gonic/gin"

	"github.com/theboyroy05/gradehub/services/auth"
	"github.com/theboyroy05/gradehub/services/mail"
	"github.com/theboyroy05/gradehub/services/middleware"
	"github.com/theboyroy05/gradehub/services/user"
	"github.com/theboyroy05/gradehub/utils"
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
	if utils.GetEnv("GIN_MODE", "debug") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()
	router.SetTrustedProxies(nil)
	router.Use(middleware.CORS())

	subrouter := router.Group("/api/v1")

	userStore := user.NewStore(api.DB)
	authStore := auth.NewStore(api.DB)
	authHandler := auth.NewHandler(authStore, userStore)
	authHandler.RegisterRoutes(subrouter)

	mailer := mail.NewMailer()
	mailHandler := mail.NewHandler(mailer)
	mailHandler.RegisterRoutes(subrouter)

	return router.Run(api.addr)
}
