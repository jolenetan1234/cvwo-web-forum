package commonerrors

import "errors"

var ErrUsernameTaken = errors.New("username already taken")
