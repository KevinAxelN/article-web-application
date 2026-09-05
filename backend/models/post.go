package models

import (
	"strings"
	"time"
)

type Post struct {
	ID          int64     `json:"id"`
	Title       string    `json:"title"`
	Content     string    `json:"content"`
	Category    string    `json:"category"`
	Status      string    `json:"status"`
	CreatedDate time.Time `json:"created_date"`
	UpdatedDate time.Time `json:"updated_date"`
}

type PostInput struct {
	Title    string `json:"title"`
	Content  string `json:"content"`
	Category string `json:"category"`
	Status   string `json:"status"`
}

func (p PostInput) Validate() map[string]string {
	errs := map[string]string{}

	title := strings.TrimSpace(p.Title)
	if title == "" {
		errs["title"] = "title wajib diisi"
	} else if len(title) < 20 {
		errs["title"] = "title minimal 20 karakter"
	}

	content := strings.TrimSpace(p.Content)
	if content == "" {
		errs["content"] = "content wajib diisi"
	} else if len(content) < 200 {
		errs["content"] = "content minimal 200 karakter"
	}

	category := strings.TrimSpace(p.Category)
	if category == "" {
		errs["category"] = "category wajib diisi"
	} else if len(category) < 3 {
		errs["category"] = "category minimal 3 karakter"
	}

	status := strings.ToLower(strings.TrimSpace(p.Status))
	if status == "" {
		errs["status"] = "status wajib diisi"
	} else if status != "publish" &&
		status != "draft" &&
		status != "thrash" {
		errs["status"] = "status harus publish, draft, atau thrash"
	}

	return errs
}
