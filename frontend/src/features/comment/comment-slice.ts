import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import Comment, { NewComment, UpdatedComment } from "./comment-types"
import { RootState } from "../../store/store"
import commentClient from "./comment-api-client"
import { deletePost } from "../post/post-slice"

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
    Comment[], // Payload type of `fulfilled` action
    string, // Argument types
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

export const deleteComment = createAsyncThunk<
    Comment, // Payload type of `fulfilled` action
    { 
        commentId: string, 
    }, // Argument types
    { rejectValue: string }
>(
    'comments/deleteComment',
    // PAYLOAD CREATOR (the thunk)
    async ({ commentId }: {
        commentId: string,
    }, { rejectWithValue }) => {
        const res = await commentClient.delete(commentId);
        if (res.type === 'success') {
            return res.data as Comment;
        } else {
            return rejectWithValue(res.error);
        }
    }
)

export const addNewComment = createAsyncThunk<
    Comment, // Payload type of `fulfilled` action
    {
        formData: NewComment,
    }, // Argument types
    { rejectValue: string }
>(
    'comments/createComment',
    // PAYLOAD CREATOR (the thunk)
    async ({ formData }: {
        formData: NewComment,
    }, { rejectWithValue }) => {
        const res = await commentClient.post(formData);
        if (res.type === 'success') {
            return res.data as Comment;
        } else {
            return rejectWithValue(res.error);
        }
    }
)

/**
 * 
 */
export const updateComment = createAsyncThunk<
    Comment, // Payload type  of `fulfilled` action
    {
        commentId: string,
        formData: UpdatedComment,
    }, // Argument types
    { rejectValue: string }
>(
    'comments/updateComment',
    // PAYLOAD CREATOR (the thunk)
    async ({ commentId, formData }: {
        commentId: string,
        formData: UpdatedComment,
    }, { rejectWithValue }) => {
        const res = await commentClient.put(commentId, formData);
        if (res.type === 'success') {
            return res.data as Comment;
        } else {
            return rejectWithValue(res.error ?? 'Failed to UPDATE comment: An unexpected error occurred.');
        };
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
        // LISTEN FOR CREATE COMMENT
        .addCase(addNewComment.fulfilled, (state, action) => {
            const newComment = action.payload;
            const postId = newComment.post_id;
            state.allComments.push(newComment);
            
            // Check if `commentsByPostId` has already been fetched for this `postId`.
            // If so, then push this comment into that state.
            if (postId in state.commentsByPostId) {
                state.commentsByPostId[postId].comments?.push(newComment);
            }
        })
        // LISTEN FOR UPDATE COMMENT
        .addCase(updateComment.fulfilled, (state, action) => {
            // action.payload is the updated Comment
            const updatedComment = action.payload;
            const postId = updatedComment.post_id;
            // NOTE: `find` returns the actual object, not a diff reference
            const originalComment = state.allComments.find(c => c.id === updatedComment.id);
            // update the state of `allComments`
            if (originalComment) {
                originalComment.content = updatedComment.content;
                originalComment.updated_at = updatedComment.updated_at;
            };
            // update the state of `commentsByPostId`
            if (postId in state.commentsByPostId) {
                const orig = state.commentsByPostId[postId].comments?.find(c => c.id === updatedComment.id);
                if (orig) {
                    orig.content = updatedComment.content;
                    orig.updated_at = updatedComment.updated_at;
                }
            }
        })
        // LISTEN FOR DELETED COMMENT
        .addCase(deleteComment.fulfilled, (state, action) => {
            const commentId = action.meta.arg.commentId;
            const deletedComment = action.payload;
            const postId = deletedComment.post_id;

            // Remove comment from `state.allComments`
            state.allComments = state.allComments.filter(comment => comment.id != commentId);

            // Search for comment in `commentsByPostId` and delete
            if (postId in state.commentsByPostId) {
                const comments = state.commentsByPostId[postId].comments;
                state.commentsByPostId[postId].comments = comments?.filter(c => c.id != commentId) ?? [];
            }
        })
        // LISTEN FOR DELETED POST
        .addCase(deletePost.fulfilled, (state, action) => {
            const postId = action.meta.arg.postId;

            if (postId in state.commentsByPostId) {
                const { [postId]: _, ...rest } = state.commentsByPostId;
                state.commentsByPostId = rest;
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
export const selectCommentsByPostId = (state: RootState) => state.comments.commentsByPostId;
// export const selectCommentsByPostId = (state: RootState, postId: string) => state.comments.commentsByPostId[postId].comments || null;
// export const selectCommentsByPostIdStatus = (state: RootState, postId: string) => state.comments.commentsByPostId[postId].status;
// export const selectCommentsByPostIdError = (staate: RootState, postId: string) => staate.comments.commentsByPostId[postId].error;
// Types