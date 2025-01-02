import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import Comment from "./comment-types"
import { RootState } from "../../store/store"
import commentClient from "./comment-api-client"

// STATE INTERFACE
/**
 * @interface CommentsState
 * 
 * @property {Comment[]} allComments - All the comments in the forum.
 */
interface CommentsState {
    allComments: Comment[],
    commentsByPostId: {
        [postId: string]: {
            comments: Comment[] | null,
            status: 'loading' | 'error' | 'success',
            error: string | null,
        }
    }, // An object with `postId` as keys and `Comment[]` as values
}

// INITIAL STATE
const initialState: CommentsState = {
    allComments: [],
    commentsByPostId: {},
}

// THUNKS
export const getCommentsByPostId = createAsyncThunk<
    Comment[],
    string,
    { rejectValue: string }
>(
    'comments/getCommentsByPostId',
    // PAYLOAD CREATOR (the thunk)
    async (postId: string, { rejectWithValue }) => {
        const res = await commentClient.getByPostId(postId);
        if (res.type === 'success') {
            return res.data as Comment[];
        } else {
            return rejectWithValue(res.error);
        }
    }
)

// SLICE
const CommentsSlice = createSlice({
    name: 'comments', // all action types will be prefixed by this
    initialState,
    reducers: {
        // generates ACTION CREATORS with the corresponding names

    },
    extraReducers: builder => {
        builder
        .addCase(getCommentsByPostId.pending, (state, action) => {
            const postId = action.meta.arg;
            state.commentsByPostId[postId] = {
                comments: null,
                status: 'loading',
                error: null,
            }
        })
        .addCase(getCommentsByPostId.fulfilled, (state, action) => {
            const postId = action.meta.arg;
            const comments = action.payload;
            state.commentsByPostId[postId] = {
                comments,
                status: 'success',
                error: null,
            };
        })
        .addCase(getCommentsByPostId.rejected, (state, action) => {
            const postId = action.meta.arg;
            state.commentsByPostId[postId] = {
                comments: null,
                status: 'error',
                error: action.payload ?? `Failed to fetch comments for post ${postId}: An unexpected error occured.`,
            }
        })
    }
})

// EXPORTS
// Action Creators
// Reducer
export default CommentsSlice.reducer;
// Selectors
export const selectAllComments = (state: RootState) => state.comments.allComments;
/** NOTE: `selectCommentsByPostId` will be undefined if `postId` is not a key in `comments.commentsByPostId`. */
export const selectCommentsByPostId = (state: RootState, postId: string) => state.comments.commentsByPostId;
// export const selectCommentsByPostId = (state: RootState, postId: string) => state.comments.commentsByPostId[postId].comments || null;
// export const selectCommentsByPostIdStatus = (state: RootState, postId: string) => state.comments.commentsByPostId[postId].status;
// export const selectCommentsByPostIdError = (staate: RootState, postId: string) => staate.comments.commentsByPostId[postId].error;
// Types