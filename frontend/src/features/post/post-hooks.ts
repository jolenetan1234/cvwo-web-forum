import { useState } from "react";
import { useFeatureFormResponse } from "../../common/types/common-types";
import { CreatePostData } from "./post-types";
import useForm from "../../common/hooks/useForm";

export function useCreatePostForm(): useFeatureFormResponse<CreatePostData> {
    const initialData = {
        title: "",
        content: "",
        category_id: "",
    }

    // HOOKS
    const { data, handleChange, resetForm } = useForm<CreatePostData>(initialData)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent): void => {
        console.log("hello");
    }

    return {
        data,
        loading,
        error,
        handleChange,
        handleSubmit
    };
}