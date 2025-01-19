import { SelectChangeEvent } from "@mui/material";
import { useState } from "react";

export function useCategory<T>(): {
    selectedCategories: T[], 
    handleCategoryChange: (event: SelectChangeEvent<T[]>) => void,
    handleCategoryDelete: (item: T) => void,
} {
    const [selectedCategories, setSelectedCategories] = useState<T[]>([]);

    const handleCategoryChange = (event: SelectChangeEvent<T[]>): void => {
        setSelectedCategories(event.target.value as T[]); // event.target.value is of type T[]
        console.log("[useCategory.handleCategoryChange] selectedCategories", selectedCategories);
    }

    const handleCategoryDelete = (item: T): void => {
        setSelectedCategories(selectedCategories.filter(
            cat => cat != item
        ));
        console.log("[useCategory.handleCategoryDelete] selectedCategories", selectedCategories);
    }

    return { selectedCategories, handleCategoryChange, handleCategoryDelete };
}