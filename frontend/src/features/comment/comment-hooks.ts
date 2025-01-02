import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { getCommentsByPostId, selectCommentsByPostId } from "./comment-slice";
import Comment from "./comment-types";

/**
 * 
 * @param {string} postId - 
 * @returns { data: Comment[], loading: boolean, error: string | null } - 
 * An object containing the `data`, `loading` and `error` states
 * needed to render the CommentSection component.
 */
export const useGetCommentsByPostId = (postId: string) => {

    const dispatch = useAppDispatch();
    const commentsByPostId = useAppSelector(
        state => selectCommentsByPostId(state, postId)
    ); // NOTE:  will be `undefined` if not yet fetched.

    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // IMPLEMENTATION #1:
    useEffect(() => {
       
        // if postId not in the hash map `commentsByPostId`, it has not been fetched yet.
        console.log('[useGetCommentsByPostId]')

        if (!(postId in commentsByPostId)) {
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