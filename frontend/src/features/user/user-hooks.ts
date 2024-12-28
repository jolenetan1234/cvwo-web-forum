import Cookies from "js-cookie";

// types
import { LoginData, SignUpData } from "./user-types";
import { useFeatureFormResponse } from "../../common/types/common-types";

// hooks
import useForm from "../../common/hooks/useForm";
import React, { useState } from "react";

// API client
import userClient from "./user-api-client";

// redux
import { useDispatch, useSelector } from "react-redux";
// userActions
import { login, logout } from "./user-slice";


/**
 * @type T - The type of data for the form.
 */
/*
interface useUserFormResponse<T> {
    data: T,
    loading: boolean,
    error: string,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>)  => void,
    handleSubmit: (e: React.FormEvent) => void,
}
    */

export function useLoginForm(handleClose: () => void): useFeatureFormResponse<LoginData> {
    const initialData: LoginData = {
        username: "",
        password: "",
    };

    // hooks
    const { data, handleChange, resetForm } = useForm<LoginData>(initialData);
    const dispatch = useDispatch();

    // initialise states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        setLoading(true);

        const loginUser = async () => {
            try {
                const res = await userClient.login(data);

                if (res.type === "success" && res.data?.user) {
                    const user = res.data.user;
                    const token = res.data.token;
                    // TODO: store the session and stuff
                   
                    console.log("[useLoginForm.handleSubmit] LOGIN SUCCESS", user);
                  
                    // dispatch login
                    dispatch(login({
                        user: user,
                        token: token,
                    }));

                    console.log("HELLO", );

                } else {
                    setError(res.error);
                    console.log("[useLoginForm.handleSubmit] LOGIN ERROR", res.error);
                }
            } catch (err: any) {
                setError("An unknown error occurred.");
            } finally {
                setLoading(false);
                // close & reset form data
                handleClose();
                resetForm();
            }
        }

        loginUser();
    }

    return {
        data,
        loading,
        error,
        handleChange,
        handleSubmit
    };
}

export function useSignUpForm(handleClose: () => void): useFeatureFormResponse<SignUpData> {
    const initialData = {
        username: "",
        password: "",
        confirm_password: "",
    };

    // hooks
    const { data, handleChange, resetForm } = useForm<{
        username: string;
        password: string;
        confirm_password: string;
    }>(initialData);

    // initialise states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        setLoading(true);

        const signUp = async (): Promise<void> => {
            // check confirm pw is same as pw.
            if (data.password != data.confirm_password) {
                alert("Passwords don't match!");
                resetForm();
                return;
            }

            try {
                // remove confirm_password field
                const sentData: SignUpData = {
                    username: data.username,
                    password: data.password
                }

                const res = await userClient.post(sentData);

                if (res.type === "success") {
                    const user = res.data;
                    console.log("[useSignUpForm.handleSubmit] SUCCESSFULLY CREATED USER", user);
                } else {
                    setError(res.error);
                }
            } catch (err: any) {
                setError("An unknown error occurred.");
            } finally {
                setLoading(false);
                // close and reset form data
                resetForm();
                handleClose();
            }
        }

        signUp();
    }

    return {
        data,
        loading,
        error,
        handleChange,
        handleSubmit
    }
}