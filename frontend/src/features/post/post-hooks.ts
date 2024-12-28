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

                    // update redux store
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