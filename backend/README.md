# Article API

A RESTful API for managing articles, built with Go and MySQL-compatible database.

## Tech Stack

* Go
* `net/http`
* MySQL
* TiDB Cloud
* golang-migrate
* `database/sql`
* MySQL Driver
* REST API
* JSON

## Features

* Create articles
* Get articles with pagination
* Get article by ID
* Update articles
* Delete articles
* Article status management:

  * Publish
  * Draft
  * Thrash
* Request validation
* CORS support
* Database migration

## Project Structure

```text
backend/
├── db/
│   └── db.go
├── handlers/
│   └── post_handler.go
├── migrations/
│   ├── 000001_create_posts_table.up.sql
│   └── 000001_create_posts_table.down.sql
├── models/
│   └── post.go
├── repository/
│   └── post_repository.go
├── .env
├── .gitignore
├── go.mod
├── go.sum
└── main.go
```

## Database

The application uses a MySQL-compatible database.

For cloud deployment, this project uses TiDB Cloud.

The `posts` table contains:

| Column       | Type         | Description               |
| ------------ | ------------ | ------------------------- |
| id           | INT          | Primary key               |
| title        | VARCHAR(200) | Article title             |
| content      | TEXT         | Article content           |
| category     | VARCHAR(100) | Article category          |
| created_date | TIMESTAMP    | Creation timestamp        |
| updated_date | TIMESTAMP    | Last update timestamp     |
| status       | VARCHAR(100) | Publish, Draft, or Thrash |

## Environment Variables

Create a `.env` file inside the `backend` directory:

```env
DB_HOST=your_database_host
DB_PORT=4000
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

Do not commit `.env` to Git.

## Installation

Clone the repository:

```bash
git clone https://github.com/KevinAxelN/article-web-application.git
```

Navigate to the backend:

```bash
cd article-web-application/backend
```

Install dependencies:

```bash
go mod download
```

## Database Migration

This project uses `golang-migrate` for database schema management.

Install `golang-migrate` if it is not already installed.

Run the migration:

```bash
migrate -path migrations -database "YOUR_DATABASE_URL" up
```

To rollback the latest migration:

```bash
migrate -path migrations -database "YOUR_DATABASE_URL" down 1
```

For a TiDB Cloud connection, the database URL may require TLS configuration.

Example:

```text
mysql://username:password@tcp(host:4000)/database?tls=true&tidb_skip_isolation_level_check=1
```

Replace the credentials and host with your own database configuration.

## Run Locally

Start the API:

```bash
go run .
```

The server runs on:

```text
http://localhost:8080
```

The port can also be configured through the `PORT` environment variable.

## API Endpoints

### Create Article

```http
POST /article/
```

Request body:

```json
{
  "title": "This is an example article title",
  "content": "This is the article content...",
  "category": "Technology",
  "status": "publish"
}
```

### Get Articles

```http
GET /article/{limit}/{offset}
```

Example:

```http
GET /article/10/0
```

### Get Article by ID

```http
GET /article/{id}
```

Example:

```http
GET /article/1
```

### Update Article

```http
PUT /article/{id}
```

Request body:

```json
{
  "title": "Updated article title",
  "content": "Updated article content...",
  "category": "Technology",
  "status": "publish"
}
```

### Delete Article

```http
DELETE /article/{id}
```

Example:

```http
DELETE /article/1
```

## Validation

The API validates incoming article data:

* Title is required and must contain at least 20 characters.
* Content is required and must contain at least 200 characters.
* Category is required and must contain at least 3 characters.
* Status is required and must be one of:

  * `publish`
  * `draft`
  * `thrash`

## Deployment

The backend can be deployed as a Go web service using a platform such as Render.

Typical deployment configuration:

```text
Root Directory: backend
Build Command: go build -o app .
Start Command: ./app
```

Required database environment variables should be configured through the hosting platform's environment variable settings.
