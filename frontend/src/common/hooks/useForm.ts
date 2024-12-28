import { useState } from "react";

/**
 * Interface for the return type of `useForm<T>`.
 * 
 * @template T - The shape of the form data object.
 * @property {T} data - The current `data` in the form.
 * @property {(e: React.ChangeEvent) => void} handleChange - The handler for a change in input.
 * @property {() => void} resetForm - The function to reset the form back to its initial state.
 */
interface useFormResponse<T> {
    data: T,
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
    resetForm: () => void,
}

function useForm<T>(
    initialData: T, 
): useFormResponse<T> {
    const [data, setData] = useState<T>(initialData);

    const resetForm = (): void => {
        setData(initialData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        // sets state of `data`

        setData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    return {
        data,
        handleChange,
        resetForm,
    };
}

export default useForm;