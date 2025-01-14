import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Post, { NewPost, UpdatedPost } from "./post-types";
import { RootState } from "../../store/store";
import forumPostClient from "./post-api-client";

// STATE INTERFACE
interface PostsState {
    allPosts: Post[],
    // filteredPosts: Post[],
    postsByCategoryId: {
        [categoryId: string]: Post[]
    },
    status: "idle" | "loading" | "success" | "failed",
    error: string | null,
}

// INITIAL STATE
const initialState: PostsState = {
    allPosts: [],
    postsByCategoryId: {},
    status: "idle",
    error: null,
}

// THUNKS (dispatch, getState): void => { // logic that can DISPATCH ACTIONS or READ STATE }
// when we call dispatch(thunk),
// it passes through the redux thunkMiddleware
// ({ dispatch, getState }) 
// => next // THIS IS JUST the `dispatch` method, OR the next middleware
// => action 
// => { // if `action` is a function, call it. 
// Else, pass it on to the next middleware via `next(action)`. }
// NOTE: thunk middleware returns wtv the called thunk function returns!!

// Eg. (dispatch, getState) => () => { const res = await fetch; return res;}

// If we call dispatch(filterPostsByCategories()) => 
// The `filterPostsbyCategories` thunk will first dispatch an action type of
// `posts/filterPostsByCategories/pending`.
// We need to listen for this action in our reducer, and mark `posts.status` = `loading`.

// Once the promise in the `payloadCreator` resolves,
// the thunk takes the data and dispatches an action
// like `{ type: 'posts/filterPostsByCategories', payload: 'res'}

// It will also dispatch an action of type `posts/filterPostsBy/Categories/fulfilled`
// REDUCER NEEDS TO LISTEN FOR THESE ACTIONS.

// NOTE: createAsyncThunk expects 2 arguments: 
// a `name` and a "payload creator" callback
/*
export const filterPostsByCategories = createAsyncThunk<
    Post[], // Payload type of `fulfilled` action
    string[], // The argument type
    { rejectValue: string } // thunkAPI config. In this case the rejected value type
>(
    'posts/filterPostsByCategories',
    // BELOW IS OUR THUNK FUNCTION DEFINITION.
    // thunk middleware returns wtv the thunk function returns.
    async (categoryIds: string[], { rejectWithValue }) => {
        const res = await forumPostClient.getByCategories(categoryIds);
        if (res.type === 'success') {
            return res.data as Post[];
        } else {
            // TODO: return rejected Promise with an error
            // the value pass into `rejectWithValue`
            // will be used as the `action.payload`.
            return rejectWithValue(res.error);
        }
    },
    // OPTIONS
    {
        // controls whether the asyncThunk should be executed.
        condition(arg, thunkApi) {
            // pass in thunkApi.getState() as the root state
            const postsStatus = selectPostsStatus(thunkApi.getState());
            if (postsStatus != 'idle') {
                return false;
            }
        }
    }
)
    */

export const fetchAllPosts = createAsyncThunk<
    Post[], // Payload type of `fulfilled` action
    void, // Argument types
    { rejectValue: string }
>(
    'posts/fetchAllPosts',
    // PAYLOAD CREATOR (the thunk)
    async (_, { rejectWithValue }) => {
        const res = await forumPostClient.getAll();
        if (res.type === 'success') {
            return res.data as Post[];
        } else {
            return rejectWithValue(res.error);
        };
    },
);

export const addNewPost = createAsyncThunk<
    Post, // Payload type of `fulfilled` action
    { newPost: NewPost, token: string }, // Argument types
    { rejectValue: string }
>(
    'posts/addNewPost',
    // PAYLOAD CREATOR (the thunk)
    async ({ newPost, token }: { newPost: NewPost, token: string }, { rejectWithValue }) => {
        const res = await forumPostClient.post(newPost, token);
        if (res.type === 'success') {
            return res.data as Post;
        } else {
            return rejectWithValue(res.error);
        }
    }
)

export const updatePost = createAsyncThunk<
    Post, // Payload type of `fulfilled` action
    { updatedPost: UpdatedPost, postId: string, token: string }, // Argument types
    { rejectValue: string }
>(
    'posts/updatePost',
    // PAYLOAD CREATOR (the thunk)
    async ({ updatedPost, postId, token }: {
        updatedPost: UpdatedPost,
        postId: string
        token: string,
    }, { rejectWithValue }) => {
        const res = await forumPostClient.put(updatedPost, postId, token);
        if (res.type === 'success') {
            return res.data as Post;
        } else {
            return rejectWithValue(res.error);
        };
    },
)

export const deletePost = createAsyncThunk<
    Post, // Payload type of `fulfilled  action
    { postId: string, token: string, }, // Argument types
    { rejectValue: string }
>(
    'posts/deletePost',
    // PAYLOAD CREATOR (the thunk)
    async ({ postId, token }: {
        postId: string,
        token: string,
    }, { rejectWithValue }) => {
        const res = await forumPostClient.delete(postId, token);
        if (res.type === 'success') {
            return res.data as Post;
        } else {
            return rejectWithValue(res.error);
        };
    },
)

// SLICE
const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        // generates ACTION CREATORS with the corresponding names
        postAdded(state, action: PayloadAction<Post>) {
            state.allPosts.push(action.payload);
        },
        /*
        filteredPostsReset(state) {
            state.filteredPosts = [];
            state.status = 'idle';
        }
        */
    },
    extraReducers: builder => {
        // addCase(actionCreator, reducer)
        builder
        // LISTEN FOR FETCH ALL POSTS
        .addCase(fetchAllPosts.pending, (state, action) => {
            state.status = 'loading';
        })
        .addCase(fetchAllPosts.fulfilled, (state, action) => {
            const allPosts = action.payload;
            state.status = 'success';
            state.allPosts = allPosts;
        })
        .addCase(fetchAllPosts.rejected, (state, action) => {
            state.status = 'failed';
        })
        // LISTEN FOR CREATE POST
        .addCase(addNewPost.fulfilled, (state, action) => {
            // action.payload is is the new Post
            state.allPosts.push(action.payload);
        })
        // LISTEN FOR UPDATE POST
        .addCase(updatePost.fulfilled, (state, action) => {
            // action.payload is the updated Post
            const updatedPost = action.payload;
            // NOTE: `find` returns the actual object, not a diff reference
            const originalPost = state.allPosts.find(post => post.id === updatedPost.id);
            // update the state
            if (originalPost) {
                originalPost.title = updatedPost.title;
                originalPost.content = updatedPost.content;
                originalPost.category_id = updatedPost.category_id;
                originalPost.updated_at = updatedPost.updated_at;
            };
        })
        // `deletePost(postId, token)`
        .addCase(deletePost.fulfilled, (state, action) => {
            const deletedPost = action.payload;
            state.allPosts = state.allPosts.filter(post => post.id != deletedPost.id);
        })
        /*
        .addCase(filterPostsByCategories.pending, (state, action) => {
            state.status = "loading";
        })
        .addCase(filterPostsByCategories.fulfilled, (state, action) => {
            state.status = "success";
            console.log("[postsSlice] filterPostsByCategories.filfilled", action.payload)
            // ADD ANY FETCHED POSTS TO THE ARRAY
            state.filteredPosts.push(...action.payload);
        })
        .addCase(filterPostsByCategories.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload ?? "An unknown error occurred";
        })
        */
    }
})

// Export ACTION CREATORS
export const { postAdded } = postsSlice.actions;
// Export REDUCER
export default postsSlice.reducer;
// Export SELECTORS
export const selectAllPosts = (state: RootState) => state.posts.allPosts;
// export const selectFilteredPosts = (state: RootState) => state.posts.filteredPosts;
export const selectPostsStatus = (state: RootState) => state.posts.status;
export const selectPostsError = (state: RootState) => state.posts.error;
// Export TYPES