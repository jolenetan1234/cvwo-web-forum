package resource

// Creating enum-like type for `Status`
type Status string

// Enum-like constants for `Status`
const (
	Success Status = "success"
	Error   Status = "error"
)

type APIResponse[T any] struct {
	Status  Status `json:"status"`
	Message string `json:"message"`
	Data    T      `json:"data"`
	Error   string `json:"error"`
}
