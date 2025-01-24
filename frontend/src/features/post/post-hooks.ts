import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UseFeatureFormResponse } from "../../common/hooks/useForm";
import Post, { NewPost, UpdatedPost } from "./post-types";
import useForm from "../../common/hooks/useForm";
import { useSelector } from "react-redux";
import { selectUserToken } from "../user/user-slice";
import { addNewPost, deletePost, fetchAllPosts, selectAllPosts, selectPostsError, selectPostsStatus, updatePost } from "./post-slice";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { isDifferent } from "../../common/utils";

/**
 * Fetches API data to populate `posts/allPosts` if necessary.
 * Else, simply returns the state as it is.
 * @returns {Post[]} the global state `posts/allPosts`.
 */
export function useAllPosts(): {
    allPosts: Post[],
    loading: boolean,
    error: string | null,
} {
    // global states
    const allPosts = useSelector(selectAllPosts);
    const postsStatus = useSelector(selectPostsStatus);
    const postsError = useSelector(selectPostsError);

    // states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // dispatch
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (postsStatus === 'idle') {
            dispatch(fetchAllPosts());
        }
    }, [dispatch]);

    useEffect(() => {
        if (postsStatus === 'loading') {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [postsStatus]);

    useEffect(() => {
        if (postsStatus === 'failed') {
            setError(postsError ?? "Error fetching all posts");
        }
    }, [postsStatus]);

    return {
        allPosts,
        loading,
        error
    };
}

export function useCreatePostForm(handleClose: () => void): UseFeatureFormResponse<NewPost> {

    // HOOKS
    // const userId = useSelector(selectUser)?.id;
    const token = useSelector(selectUserToken);
    const dispatch = useAppDispatch();

    const initialData: NewPost = {
        title: "",
        content: "",
        category_id: "",
        // user_id: userId ?? "",
    }

    // Leave the form data handling to `useForm`
    const { data: formData, handleChange, resetForm } = useForm<NewPost>(initialData)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();

        console.log("[useCreatePostForCreatem.handleSubmit()], formData", formData);

        const createPost = async () => {
            setLoading(true);

            try {
                if (!token) {
                    setError("401 Unauthorised");
                } else {
                    // unwrapping it returns a NEW Promise
                    // with either the `action.payload` value from a `fulfilled` action
                    // or throw an error if it's the `rejected ` action.
                    await dispatch(addNewPost({ newPost: formData })).unwrap();
                    // close and reset form
                    handleClose();
                }
            } catch (err: any) {
                setError(err) ;
            } finally {
                setLoading(false);
                // reset form
                resetForm();
            }
        }

        createPost();
    }

    return {
        data: formData,
        loading,
        error,
        handleChange,
        handleSubmit
    };
}

export function useEditPostForm(post: Post, handleClose: () => void): UseFeatureFormResponse<UpdatedPost> {

    const dispatch = useAppDispatch();
    const token = useSelector(selectUserToken);

    // states
    // const { allPosts } = useAllPosts();
    // const [initialData, setInitialData] = useState<UpdatedPost>({
    //     title: ,
    //     content: "",
    //     category_id: "",
    // })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // initial form data
    const initialData: UpdatedPost = {
        title: post.title,
        content: post.content,
        category_id: post.category_id,
    }

    const { data: formData, handleChange, resetForm } = useForm<UpdatedPost>(initialData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('[useEditPostForm.handleSubmit()], formData', formData);

        const update = async () => {
            setLoading(true);

            try {
                if (!token) {
                    setError("401 Unauthorised");
                } else if (!isDifferent(formData, post)) {
                    // Next, check if there are actually any edits made.
                    // If not,
                    // simply close the form without trigerring any actions.
                    handleClose();
                } else {
                    // this will definitely succeed. 
                    // Will throw error if rejected.
                    await dispatch(updatePost({ 
                        updatedPost: formData,
                        postId: post.id,
                    })).unwrap();

                    // close the form
                    handleClose();
                }
            } catch (err: any) {
                console.log("[useEditPostForm.handleSubmit] Failed to update post", err);
                if (typeof err === 'string') {
                    setError(err);
                } else {
                    setError(err.message ?? "An unexpected error occurred.");
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

export function usePostDelete(postId: string | null, handleClose: () => void) {

    const dispatch = useAppDispatch();
    const token = useAppSelector(selectUserToken);
    const navigate = useNavigate();

    // states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = () => {
        const del = async () => {
            setLoading(true);

            try {
                if (!postId) {
                    setError('Failed to DELETE post: PostID is null');
                } else if (!token) {
                    setError('401 Unauthorised');
                } else {
                    const deletedPost = await dispatch(deletePost({ postId })).unwrap();
                    console.log(`[usePostDelete.handleDelete] Successfully deleted post ${postId}`, deletedPost);
                    navigate("/");
                    handleClose();
                }
            } catch (err: any) {
                if (typeof err === 'string') {
                    setError(err);
                } else {
                    setError(err.message ?? 'Failed to DELETE post: An unexpected error occured.');
                }
            } finally {
                setLoading(false);
            }
        }

        del();
    }

    return {
        loading,
        error,
        handleDelete
    }
}