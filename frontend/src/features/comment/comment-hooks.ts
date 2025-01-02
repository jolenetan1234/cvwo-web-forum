import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { deleteComment, getCommentsByPostId, selectCommentsByPostId } from "./comment-slice";
import Comment from "./comment-types";
import { selectUserToken } from "../user/user-slice";

// hi

/**
 * 
 * @param {string} postId - 
 * @returns { data: Comment[], loading: boolean, error: string | null } - 
 * An object containing the `data`, `loading` and `error` states
 * needed to render the CommentSection component.
 */
export const useGetCommentsByPostId = (postId: string) => {

    const dispatch = useAppDispatch();
    const commentsByPostId = useAppSelector(selectCommentsByPostId) // NOTE:  will be `undefined` if not yet fetched.

    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // IMPLEMENTATION #1:
    useEffect(() => {
       
        console.log('[useGetCommentsByPostId]')

        if (!(postId in commentsByPostId)) {
        // postId not in the hash map `commentsByPostId` iff it has not been fetched yet.
        // so fetch it
            dispatch(getCommentsByPostId(postId));
            
        } else {
            const comments = commentsByPostId[postId].comments;
            const status = commentsByPostId[postId].status;
            const error = commentsByPostId[postId].error;

            if (status === 'success') {
            // If already fetched, just read directly from the store.
                setComments(comments as Comment[]);
                setLoading(false);
            } else if (status === 'loading') {
                setLoading(true);
            } else if (status === 'error') {
                setError(error ?? `[useGetCommentsByPostId] Failed to get comments for post ${postId}`);
            }
        };

    }, [dispatch, postId, commentsByPostId]);

    // IMPLEMENTATION #2:
    /*
    useEffect(() => {
        // if postId not in the hash map `commentsByPostId`, it has not been fetched yet.
        if (!(postId in commentsByPostId)) {

            const fetchCommentsByPostId = async () => {
                console.log('[CommentSectionComponent.fetchCommentsByPostId]');
                setLoading(true);

                try {
                    const res = await dispatch(getCommentsByPostId(postId)).unwrap();
                    setComments(res);
                } catch (err: any) {
                    setError(err);
                } finally {
                    setLoading(false);
                }
            }

            fetchCommentsByPostId();
            
        } else {
            // If already fetched, just read directly from the store.
            setComments(commentsByPostId[postId]);
        };

    }, [dispatch, postId, commentsByPostId]);
    */

    // WRONG IMPLEMENTATION:
    /*
    useEffect(() => {

        console.log("[useGetCommentsByPostId] WRONG IMPLEMENTATION");

        if (!(postId in commentsByPostId)) {
            dispatch(getCommentsByPostId(postId));
        }

        const comments = commentsByPostId[postId].comments; // undefined
        const status = commentsByPostId[postId].status; // undefined
        const error = commentsByPostId[postId].error; // undefined


        if (status === 'success') {
            setComments(comments as Comment[]);
            setLoading(false);
        } else if (status === 'loading') {
            setLoading(true);
        } else if (status === 'error') {
            setError(error ?? `[useGetCommentsByPostId] Failed to get comments for post ${postId}`);
        }

    }, [dispatch, postId, commentsByPostId]);
    */

    return {
        data: comments,
        loading,
        error
    }
}

/**
 * Custom hook to handle the deletion of a comment.
 * 
 * @param {string | null} commentId - The ID of the comment to delete. If null, an error will be set.
 * @param {() => void} handleClose - A callback function executed after the comment is successfully deleted.
 *
 * @returns {Object} An object containing the following properties:
 * @property {boolean} loading - Indicates whether the delete operation is in progress.
 * @property {string | null} error - Contains an error message if the delete operation fails, or null otherwise.
 * @property {() => void} handleDelete - A function to initiate the delete operation. 
 */
export const useCommentDelete = (
    commentId: string | null, 
    handleClose: () => void,
) => {

    const dispatch = useAppDispatch();
    const token = useAppSelector(selectUserToken);

    // return { loading, error, handleDelete }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handleDelete = () => {

        const del = async () => {

            try {
                if (!token) {
                    setError('Failed to DELETE comment: 401 unauthorised');
                } else if (!commentId) {
                    setError('Failed to DELETE comment: Comment ID is null');
                } else {
                    setLoading(true);
                    await dispatch(deleteComment({ commentId, token })).unwrap();
                    handleClose();
                };
            } catch (err: any) {
                setError(err.message ?? 'Failed to DELETE comment: An unexpected error occurred');
            } finally {
                setLoading(false);
            }

        }

        del();
    };

    return {
        loading,
        error,
        handleDelete,
    };

}