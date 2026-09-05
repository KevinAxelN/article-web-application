package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"article-api/models"
	"article-api/repository"
)

type PostHandler struct {
	repo *repository.PostRepository
}

func NewPostHandler(repo *repository.PostRepository) *PostHandler {
	return &PostHandler{repo: repo}
}

// POST /article/
func (h *PostHandler) Create(w http.ResponseWriter, r *http.Request) {
	var input models.PostInput

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "body JSON tidak valid", nil)
		return
	}

	if errs := input.Validate(); len(errs) > 0 {
		writeError(w, http.StatusUnprocessableEntity, "validasi gagal", errs)
		return
	}

	post, err := h.repo.Create(r.Context(), input)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "gagal membuat article", nil)
		return
	}

	writeJSON(w, http.StatusCreated, post)
}

// GET /article/{limit}/{offset}
func (h *PostHandler) List(w http.ResponseWriter, r *http.Request) {
	limit, err := strconv.Atoi(r.PathValue("limit"))
	if err != nil || limit <= 0 {
		writeError(w, http.StatusBadRequest, "limit tidak valid", nil)
		return
	}

	offset, err := strconv.Atoi(r.PathValue("offset"))
	if err != nil || offset < 0 {
		writeError(w, http.StatusBadRequest, "offset tidak valid", nil)
		return
	}

	posts, err := h.repo.List(r.Context(), limit, offset, "")
	if err != nil {
		writeError(w, http.StatusInternalServerError, "gagal mengambil article", nil)
		return
	}

	writeJSON(w, http.StatusOK, posts)
}

// GET /article/{id}
func (h *PostHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil || id <= 0 {
		writeError(w, http.StatusBadRequest, "id tidak valid", nil)
		return
	}

	post, err := h.repo.GetByID(r.Context(), id)

	if err == sql.ErrNoRows {
		writeError(w, http.StatusNotFound, "article tidak ditemukan", nil)
		return
	}

	if err != nil {
		writeError(w, http.StatusInternalServerError, "gagal mengambil article", nil)
		return
	}

	writeJSON(w, http.StatusOK, post)
}

// PUT /article/{id}
func (h *PostHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil || id <= 0 {
		writeError(w, http.StatusBadRequest, "id tidak valid", nil)
		return
	}

	var input models.PostInput

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "body JSON tidak valid", nil)
		return
	}

	if errs := input.Validate(); len(errs) > 0 {
		writeError(w, http.StatusUnprocessableEntity, "validasi gagal", errs)
		return
	}

	post, err := h.repo.Update(r.Context(), id, input)

	if err == sql.ErrNoRows {
		writeError(w, http.StatusNotFound, "article tidak ditemukan", nil)
		return
	}

	if err != nil {
		writeError(w, http.StatusInternalServerError, "gagal mengubah article", nil)
		return
	}

	writeJSON(w, http.StatusOK, post)
}

// DELETE /article/{id}
func (h *PostHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil || id <= 0 {
		writeError(w, http.StatusBadRequest, "id tidak valid", nil)
		return
	}

	err = h.repo.Delete(r.Context(), id)

	if err == sql.ErrNoRows {
		writeError(w, http.StatusNotFound, "article tidak ditemukan", nil)
		return
	}

	if err != nil {
		writeError(w, http.StatusInternalServerError, "gagal menghapus article", nil)
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{
		"message": "article berhasil dihapus",
	})
}

func writeJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func writeError(
	w http.ResponseWriter,
	status int,
	message string,
	fields map[string]string,
) {
	body := map[string]interface{}{
		"error": message,
	}

	if len(fields) > 0 {
		body["fields"] = fields
	}

	writeJSON(w, status, body)
}
