package utils

import (
	"fmt"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/resource"
)

func CategoryMapper(cat entity.Category) resource.Category {
	res := resource.Category{
		ID:    fmt.Sprintf("%d", cat.ID),
		Value: cat.Value,
		Label: cat.Label,
	}

	return res
}
