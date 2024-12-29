import { createAsyncThunk } from "@reduxjs/toolkit";
import Post from "./post-types";

interface PostState {
    allPosts: Post[],
    filteredPosts: Post[]

}

// thunks to populate the state
const filterPostsByCategories = createAsyncThunk(
    'post/filterPostsByCategories',
    async () => {
        // 
    }
)