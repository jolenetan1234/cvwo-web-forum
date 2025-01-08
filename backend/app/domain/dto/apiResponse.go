package dto

type APIResponse[T any] struct {
	Status  string
	Message string
	Data    T
}
