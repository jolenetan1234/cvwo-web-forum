package utils

import (
	"fmt"
	"time"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/resource"
)

// MapSlice takes in a []T and a mapper function.
// It applies that function to each element of T,
// returning the resultant slice []R.
func MapSlice[T any, R any](slice []T, mapper func(T) R) []R {
	res := make([]R, len(slice))
	for i, v := range slice {
		res[i] = mapper(v)
	}
	return res
}

// CategoryMapper maps an `entity.Category` to a `resource.Category`.
func CategoryMapper(cat entity.Category) resource.Category {
	res := resource.Category{
		ID:    fmt.Sprintf("%d", cat.ID),
		Value: cat.Value,
		Label: cat.Label,
	}

	return res
}

// PostMapper maps an `entity.Post` to a `resource.Post`.
func PostMapper(post entity.Post) resource.Post {
	res := resource.Post{
		ID:         fmt.Sprintf("%d", post.ID),
		Title:      post.Title,
		Content:    post.Content,
		CategoryID: fmt.Sprintf("%d", post.CategoryID),
		UserID:     fmt.Sprintf("%d", post.UserID),
		CreatedAt:  post.CreatedAt.Format(time.RFC3339),
		UpdatedAt:  post.UpdatedAt.Format(time.RFC3339),
	}

	return res
}

// CommentMapper maps an `entity.Comment` to a `resource.Comment`.
func CommentMapper(cmt entity.Comment) resource.Comment {
	res := resource.Comment{
		ID:        fmt.Sprintf("%d", cmt.ID),
		Content:   cmt.Content,
		PostID:    fmt.Sprintf("%d", cmt.PostID),
		UserID:    fmt.Sprintf("%d", cmt.UserID),
		CreatedAt: cmt.CreatedAt.Format(time.RFC3339),
		UpdatedAt: cmt.UpdatedAt.Format(time.RFC3339),
	}

	return res
}
