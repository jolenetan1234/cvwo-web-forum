package utils

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
