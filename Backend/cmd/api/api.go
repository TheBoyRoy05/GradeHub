package api

import (
	"time"
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"

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

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	subrouter := router.Group("/api/v1")

	userStore := user.NewStore(api.DB)
	userHandler := user.NewHandler(userStore)
	userHandler.RegisterRoutes(subrouter)

	return router.Run(api.addr)
}