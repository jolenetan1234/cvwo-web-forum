import { useNavigate } from "react-router-dom";

// types
import { LoginData, SignUpData } from "./user-types";
import { UseFeatureFormResponse } from "../../common/hooks/useForm";

// hooks
import useForm from "../../common/hooks/useForm";
import React, { useState } from "react";

// API client
import userClient from "./user-api-client";

// redux
import { useDispatch } from "react-redux";
// userActions
import { login, logout } from "./user-slice";
import { clearSessionInCookies, storeSessionInCookies } from "./user-utils";
import { useAppDispatch } from "../../store/store-hooks";


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

const useLoginForm = (handleClose: () => void): UseFeatureFormResponse<LoginData> => {
    const initialData: LoginData = {
        username: "",
        password: "",
    };

    // hooks
    const { data, handleChange, resetForm } = useForm<LoginData>(initialData);
    const dispatch = useDispatch();

    // initialise states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        setLoading(true);

        const loginUser = async () => {
            try {
                const res = await userClient.login(data);

                if (res.type === "success" && res.data?.user) {
                    const user = res.data.user;
                    // TODO: store the session and stuff
                   
                    console.log("[useLoginForm.handleSubmit] LOGIN SUCCESS", user);
                  
                    // dispatch login, to update redux store
                    dispatch(login({
                        user: user,
                        token: "h",
                    }));

                    // store session in browser cookies - can be accessed later on
                    storeSessionInCookies(user, "h");

                    // close the form
                    handleClose();
                } else {
                    setError(res.error);
                    console.log("[useLoginForm.handleSubmit] LOGIN ERROR", res.error);
                }
            } catch (err: any) {
                setError("An unknown error occurred.");
                console.log("[useLoginForm.handleSubmit] Failed to login", err);
            } finally {
                setLoading(false);
                // reset form data
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

const useSignUpForm = (handleClose: () => void): UseFeatureFormResponse<SignUpData> => {
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

    const navigate = useNavigate();

    // initialise states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        setLoading(true);

        const signUp = async (): Promise<void> => {

            try {
                // check confirm pw is same as pw.
                if (data.password != data.confirm_password) {
                    alert("Passwords don't match!");
                    resetForm();
                } else {
                    // remove confirm_password field
                    const sentData: SignUpData = {
                        username: data.username,
                        password: data.password
                    }

                    const res = await userClient.post(sentData);

                    if (res.type === "success") {
                        const user = res.data;
                        console.log("[useSignUpForm.handleSubmit] SUCCESSFULLY CREATED USER", user);

                        navigate('/');
                    } else {
                        setError(res.error);
                    }
                }
                
            } catch (err: any) {
                setError("An unknown error occurred.");
                console.log("[useSignUpForm.handleSubmit] Failed to CREATE user", err);
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

const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        setLoading(true);
        const res = await userClient.logout();

        if (res.type === "success") {
            console.log("")

            // REMOVE SESSION FROM COOKIES
            clearSessionInCookies();

            // UPDATE REDUX STORE
            dispatch(logout());
        } else {
            setError(res.error);
        }

        setLoading(false);
    }

    return {
        loading,
        error,
        handleLogout
    }
}

export { useLoginForm, useSignUpForm, useLogout }