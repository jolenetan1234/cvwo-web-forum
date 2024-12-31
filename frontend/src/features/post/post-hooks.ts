import { useState, useEffect } from "react";
import { useFeatureFormResponse } from "../../common/types/common-types";
import Post, { CreatePostData } from "./post-types";
import useForm from "../../common/hooks/useForm";
import forumPostClient from "./post-api-client";
import { useSelector } from "react-redux";
import { selectUser, selectUserToken } from "../user/user-slice";
import { fetchAllPosts, selectAllPosts, selectPostsError, selectPostsStatus } from "./post-slice";
import { useAppDispatch } from "../../store/store-hooks";

/**
 * Fetches API data to populate `posts/allPosts` if necessary.
 * Else, simply returns the state as it is.
 * @returns {Post[]} the global state `posts/allPosts`.
 */
export function useAllPosts(): {
    allPosts: Post[],
    loading: boolean,
    error: string,
} {
    // global states
    const allPosts = useSelector(selectAllPosts);
    const postsStatus = useSelector(selectPostsStatus);
    const postsError = useSelector(selectPostsError);

    // states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
    })

    return {
        allPosts,
        loading,
        error
    };
}

export function useCreatePostForm(handleClose: () => void): useFeatureFormResponse<CreatePostData> {

    // HOOKS
    const userId = useSelector(selectUser)?.id;

    const initialData = {
        title: "",
        content: "",
        category_id: "",
        user_id: userId,
    }

    const { data, handleChange, resetForm } = useForm<CreatePostData>(initialData)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const userToken = useSelector(selectUserToken);

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();

        console.log("[useCreatePostForm.handleSubmit()], data", data);

        const createPost = async () => {
            setLoading(true);

            try {
                const res = await forumPostClient.post(data, userToken);

                // if successfully posted
                if (res.type === "success") {
                    const newPost = res.data;
                    console.log("[useCreatePostForm.handleSubmit.createPost] SUCCESSFULLY CREATED POST", newPost);

                    // TODO: need add userId into formData and into forumPostClient.
                    // TODO: dispatch(postAdded(formData))
                    // postAdded(formData) will send a POST request to the server,
                    // then update the `postsSlice` state with the returned post object.
                } else {
                    setError(res.error);
                    console.log("[useCreatePostForm.handleSubmit.createPost] FAILED TO CREATE POST", res.error);
                }
                
                
                // JUST DISPATCH postAdded

                // tbh idk how to handle the error lol
                // error = useSelector(selectPostError)
            } catch (err: any) {
                setError("An unknown error occurred.") ;
            } finally {
                setLoading(false);
                // close and reset form
                handleClose();
                resetForm();
            }
        }

        createPost();
    }

    return {
        data,
        loading,
        error,
        handleChange,
        handleSubmit
    };
}

export function useStoreFilter<T>(): {
    data: T[],
    error: string,
    loading: boolean,
} {
    // const data = useSelector(filteredListSelector)
    // only ask redux store to fetch filtered list from backend
    // and update posts[]

    // const categoryIds = useSelector(filterSelector())
    // in this case, filterSelector = eg. `() => state.post.categoryIds` 

    // TODO: `dispatch(filterPostsByCategories(categoryIds: string[])) => updates state of `post/filteredPosts`
    // TODO: fetch posts and return as `data` - const data = useSelector(filteredListSelector()) - eg. () => state.post.filteredPosts
    // TODO: fetch error from 

    return {
        data,
        error,
        loading,
    }
}