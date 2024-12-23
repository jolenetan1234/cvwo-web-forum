// types
import { LoginData } from "./user-types";

// hooks
import useForm from "../../common/hooks/useForm";
import { useState } from "react";

// API client
import userClient from "./user-api-client";

interface useLoginFormResponse {
    data: LoginData,
    loading: boolean,
    error: string,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>)  => void,
    handleSubmit: () => void,
}

export function useLoginForm(handleClose: () => void): useLoginFormResponse {
    const initialData: LoginData = {
        username: "",
        password: "",
    };

    // hooks
    const { data, handleChange, resetForm } = useForm<LoginData>(initialData);

    // initialise states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (): void => {
        setLoading(true);

        const login = async () => {
            try {
                const res = await userClient.login(data);

                if (res.type === "success" && res.data?.user) {
                    const user = res.data.user;
                   // TODO: store the session and stuff 
                   console.log("[useLoginForm.handleSubmit] LOGIN SUCCESS", user)
                } else {
                    setError(res.error);
                }
            } catch (err: any) {
                setError("An unknown error occurred.");
            }
        }

        login();
        setLoading(false);
        // close & reset form data
        handleClose();
        resetForm();
    }

    return {
        data,
        loading,
        error,
        handleChange,
        handleSubmit
    };
}