package resource

type Comment struct {
	ID        string `json:"id"`
	Content   string `json:"content"`
	PostID    string `json:"post_id"`
	UserID    string `json:"user_id"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

// The shape of the data from the frontend
// needed to create a new comment.
type CreateCommentRequest struct {
	Content string `json:"content"`
}

// The shape of the data from the frontend
// needed to update an existing comment.
type UpdateCommentRequest struct {
	Content string `json:"content"`
}
