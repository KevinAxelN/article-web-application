package repository

import (
	"context"
	"database/sql"
	"strings"
	"time"

	"article-api/models"
)

type PostRepository struct {
	db *sql.DB
}

func NewPostRepository(db *sql.DB) *PostRepository {
	return &PostRepository{db: db}
}

func normalizeStatus(s string) string {
	return strings.ToLower(strings.TrimSpace(s))
}

// Create menyimpan article baru.
func (r *PostRepository) Create(ctx context.Context, in models.PostInput) (models.Post, error) {
	now := time.Now().UTC()
	status := normalizeStatus(in.Status)

	res, err := r.db.ExecContext(ctx,
		`INSERT INTO posts (title, content, category, status, created_date, updated_date)
		 VALUES (?, ?, ?, ?, ?, ?)`,
		in.Title, in.Content, in.Category, status, now, now,
	)
	if err != nil {
		return models.Post{}, err
	}

	id, err := res.LastInsertId()
	if err != nil {
		return models.Post{}, err
	}

	return models.Post{
		ID:          id,
		Title:       in.Title,
		Content:     in.Content,
		Category:    in.Category,
		Status:      status,
		CreatedDate: now,
		UpdatedDate: now,
	}, nil
}

// List mengambil article dengan paging (limit & offset), opsional difilter by status.
func (r *PostRepository) List(ctx context.Context, limit, offset int, status string) ([]models.Post, error) {
	query := `SELECT id, title, content, category, status, created_date, updated_date FROM posts`
	args := []interface{}{}

	if status != "" {
		query += ` WHERE status = ?`
		args = append(args, normalizeStatus(status))
	}

	query += ` ORDER BY id DESC LIMIT ? OFFSET ?`
	args = append(args, limit, offset)

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	posts := []models.Post{}
	for rows.Next() {
		var p models.Post
		if err := rows.Scan(&p.ID, &p.Title, &p.Content, &p.Category, &p.Status, &p.CreatedDate, &p.UpdatedDate); err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, rows.Err()
}

// GetByID mengambil satu article. Mengembalikan sql.ErrNoRows kalau tidak ketemu.
func (r *PostRepository) GetByID(ctx context.Context, id int64) (models.Post, error) {
	var p models.Post
	err := r.db.QueryRowContext(ctx,
		`SELECT id, title, content, category, status, created_date, updated_date
		 FROM posts WHERE id = ?`, id,
	).Scan(&p.ID, &p.Title, &p.Content, &p.Category, &p.Status, &p.CreatedDate, &p.UpdatedDate)
	return p, err
}

// Update mengubah article yang sudah ada.
func (r *PostRepository) Update(ctx context.Context, id int64, in models.PostInput) (models.Post, error) {
	if _, err := r.GetByID(ctx, id); err != nil {
		return models.Post{}, err // termasuk sql.ErrNoRows kalau id tidak ada
	}

	now := time.Now().UTC()
	status := normalizeStatus(in.Status)

	_, err := r.db.ExecContext(ctx,
		`UPDATE posts SET title=?, content=?, category=?, status=?, updated_date=? WHERE id=?`,
		in.Title, in.Content, in.Category, status, now, id,
	)
	if err != nil {
		return models.Post{}, err
	}

	return r.GetByID(ctx, id)
}

// Delete menghapus article secara permanen (hard delete).
// memindahkan article ke "trash" itu beda aksi -> pakai Update dengan status="thrash".
func (r *PostRepository) Delete(ctx context.Context, id int64) error {
	if _, err := r.GetByID(ctx, id); err != nil {
		return err
	}
	_, err := r.db.ExecContext(ctx, `DELETE FROM posts WHERE id = ?`, id)
	return err
}
