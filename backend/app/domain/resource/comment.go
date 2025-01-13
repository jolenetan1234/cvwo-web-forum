package resource

type Comment struct {
	ID        string `json:"id"`
	Content   string `json:"content"`
	PostID    string `json:"post_id"`
	UserID    string `json:"user_id"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}
