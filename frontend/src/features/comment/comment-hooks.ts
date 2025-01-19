import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { addNewComment, deleteComment, getCommentsByPostId, selectCommentsByPostId, updateComment } from "./comment-slice";
import Comment, { NewComment, UpdatedComment } from "./comment-types";
import { selectUserToken } from "../user/user-slice";
import { UseFeatureFormResponse } from "../../common/hooks/useForm";
import useForm from "../../common/hooks/useForm";
import { useIsEditCommentOpen } from "../../common/contexts/IsEditCommentOpenContext";
import { isDifferent } from "../../common/utils";
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

    return {
        data: comments,
        loading,
        error
    }
}

/**
 * A custom hook for managing the state and submission of a form to create a new comment.
 *
 * @param {string} postId - The ID of the post to which the comment is being added.
 * @param {() => void} handleClose - A callback function to be executed after the form is successfully submitted.
 * 
 * @returns {Object} An object containing:
 * @property {{ content: string, postId: string }} data - The current form data of type `NewComment`.
 * @property {boolean} loading - A boolean indicating whether the comment creation is in progress.
 * @property {string | null} error - A string representing the error message, or `null` if no error occurred.
 * @property {() => void} handleChange - A function to update the form data fields.
 * @property {() => void} handleSubmit - A function to handle the form submission.
 *
 * @param postId 
 * @param handleClose 
 * @returns 
 */
export const useCreateCommentForm = (postId: string, handleClose: () => void): UseFeatureFormResponse<NewComment> => {

    // HOOKS
    const dispatch = useAppDispatch();
    const token = useAppSelector(selectUserToken)

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initialData: NewComment = {
        content: '',
        post_id: postId,
    }

    const { data: formData, handleChange, resetForm } = useForm<NewComment>(initialData);

    /**
     * The handler for the "submit form" event.
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const createComment = async () => {
            try {
                if (!token) {
                    setError('404 Unauthorised');
                } else if (!postId) {
                    setError('Failed to CREATE comment: Post ID is null');
                } else {
                    // await the async thunk dispatch
                    setLoading(true);
                    const newComment = await dispatch(addNewComment({ formData }));
                    handleClose();

                    console.log('[useCreateCommentForm.handleSubmit] Successfully CREATE comment', newComment);
                }
            } catch (err: any) {
                console.log('[useCreateCommentForm.handleSubmit] Failed to CREATE comment', err);
                if (typeof err === 'string') {
                    setError(err);
                } else {
                    setError(err.message || 'Failed to CREATE comment: An unexpected error occurred.');
                }
            } finally {
                setLoading(false);
                resetForm();
            }
        }

        createComment();
    }

    return {
        data: formData,
        loading,
        error,
        handleChange,
        handleSubmit,
    }
}

export const useEditCommentForm = (handleClose: () => void): UseFeatureFormResponse<UpdatedComment> => {


    // HOOKS
    const dispatch = useAppDispatch();
    const { comment } = useIsEditCommentOpen(); // take from provider
    const token = useAppSelector(selectUserToken);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initialData: UpdatedComment = {
        content: comment?.content ?? '',
    };

    const { data: formData, handleChange, resetForm } = useForm<UpdatedComment>(initialData);

    /**
     * The handler for the "submit form" event.
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const update = async () => {
            try {
                if (!token) {
                    setError('401 Unauthorised');
                } else if (!comment) {
                    setError('Failed to UPDATE comment: Comment does not exist');
                } else if (!isDifferent(formData, comment)) {
                    // If no change in content,
                    // simply close the form without dispatching any actions.
                    handleClose();
                } else {
                    setLoading(true);
                    // unwrap the thunk promise
                    const updatedComment = await dispatch(updateComment({ commentId: comment.id, formData }));
                    handleClose();

                    console.log('[useEditCommentForm.handleSubmit] Successfully UPDATED comment', updatedComment);
                }
            } catch (err: any) {
                console.log('[useEditCommentForm.handleSubmit] Failed to UPDATE comment', err);
                if (typeof err === 'string') {
                    setError(err);
                } else {
                    setError(err.message ?? 'Failed to UPDATE comment: An unexpected error occurred.');
                }
            } finally {
                setLoading(false);
                resetForm();
            }
        }

        update();
    }

    return {
        data: formData,
        loading,
        error,
        handleChange,
        handleSubmit
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
    commentId: string,
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
                    await dispatch(deleteComment({ commentId })).unwrap();
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