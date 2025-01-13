package resource

type Post struct {
	ID         string `json:"id"`
	Title      string `json:"title"`
	Content    string `json:"content"`
	CategoryID string `json:"category_id"`
	UserID     string `json:"user_id"`
	CreatedAt  string `json:"created_at"`
	UpdatedAt  string `json:"updated_at"`
}

// The shape of the data from the frontend
// needed to create a new post.
type CreatePostRequest struct {
	Title      string `json:"title"`
	Content    string `json:"content"`
	CategoryID string `json:"category_id"`
}
