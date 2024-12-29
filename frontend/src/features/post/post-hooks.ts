import { useState } from "react";
import { useFeatureFormResponse } from "../../common/types/common-types";
import { CreatePostData } from "./post-types";
import useForm from "../../common/hooks/useForm";
import forumPostClient from "./post-api-client";
import { useSelector } from "react-redux";
import { selectUserToken } from "../user/user-slice";

export function useCreatePostForm(handleClose: () => void): useFeatureFormResponse<CreatePostData> {
    const initialData = {
        title: "",
        content: "",
        category_id: "",
    }

    // HOOKS
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

                    // TODO: update redux store
                } else {
                    setError(res.error);
                    console.log("[useCreatePostForm.handleSubmit.createPost] FAILED TO CREATE POST", res.error);
                }
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