// components
import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

// hooks
import useFetch from "../../common/hooks/useFetch";

// API clients
import categoryClient from "./category-api-client";
import { CreatePostButton } from "../post/post-components";
import { useCallback } from "react";

/**
 * A subheader containing the options for categories.
 * @returns The subheader above Cards.
 */
export function CategoryHeader({ handleCategoryChange, handleCategoryDelete, selectedCategories }: {
   handleCategoryChange: (event: SelectChangeEvent<string[]>) => void,
   handleCategoryDelete: (catId: string) => void,
   selectedCategories: string[],
}): JSX.Element {

    // hooks
    // fetch all categories

    // memoise the callback
    const fetchAllCategories = useCallback(
      () => categoryClient.getAll(), []
    );

    /*
    const { data, error, loading } = useFetch(
        () => categoryClient.getAll()
    );
    */
   const { data } = useFetch(fetchAllCategories);
    const categories = data;
    
    return (
       <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <FormControl sx={{ m: 2, width: 500 }}>
            <InputLabel>Categories</InputLabel>
            <Select
              multiple
              value={selectedCategories}
              onChange={handleCategoryChange}
              input={<OutlinedInput label="Categories" />}
                  renderValue={(selected) => (
                    <Stack gap={1} direction="row" flexWrap="wrap">

                      {selected.map((catId) => {
                          // we do this to access the label of each category
                          const category = categories?.find(cat => cat.id === catId);
                          return (
                          <Chip
                          key={catId} 
                          label={category?.label}
                          onDelete = {() => handleCategoryDelete(catId)}
                          deleteIcon={
                              <CancelIcon
                          onMouseDown={e => e.stopPropagation()}
                          />
                          }
                      />
                          );
                  })}
                  </Stack>
              )}
            >
            {categories?.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Create post button */}
        <CreatePostButton />
       </Box>
    )
}