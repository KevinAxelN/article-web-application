package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"

	"article-api/db"
	"article-api/handlers"
	"article-api/repository"
)

func main() {
	// Load environment variables from .env
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found")
	}

	// Connect to database
	database, err := db.Connect()
	if err != nil {
		log.Fatal(err)
	}
	defer database.Close()

	log.Println("Successfully connected to database")

	// Repository
	postRepo := repository.NewPostRepository(database)

	// Handler
	postHandler := handlers.NewPostHandler(postRepo)

	// Router
	mux := http.NewServeMux()

	mux.HandleFunc("POST /article/", postHandler.Create)
	mux.HandleFunc("GET /article/{limit}/{offset}", postHandler.List)
	mux.HandleFunc("GET /article/{id}", postHandler.GetByID)
	mux.HandleFunc("PUT /article/{id}", postHandler.Update)
	mux.HandleFunc("DELETE /article/{id}", postHandler.Delete)

	// Start server
	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	log.Printf("Server running on port %s", port)

	handler := corsMiddleware(mux)

	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatal(err)
	}
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		if origin == "http://localhost:3000" ||
			origin == "https://article-web-application.vercel.app" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
