// The `commonerrors` package defines custom errors used in this app.
package commonerrors

import "errors"

var ErrInvalidCredentials = errors.New("invalid username or password")
var ErrUnauthorised = errors.New("unauthorised")
