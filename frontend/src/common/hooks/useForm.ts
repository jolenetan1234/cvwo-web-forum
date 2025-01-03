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
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>/*React.ChangeEvent<HTMLInputElement | HTMLSelectElement>*/) => void,
    resetForm: () => void,
}


/**
 * @interface useFeatureFormResponse
 * @template T - The shape of the form data object.
 * 
 * @property {T} data - The current values of the form data object.
 * @property {boolean} loadiing - The current loading state of the form, during form submission.
 * @property {string} error - The string error (if any) during form submission.
 * @property {(e: React.ChangeEvent) => void} handleChange - The handler for changes in form input.
 * @property {(e: React.FormEvent) => void} handleSubmit - The handler when "submit" is clicked.
 * 
 */
export interface UseFeatureFormResponse<T> {
    data: T,
    loading: boolean,
    error: string | null,
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>/*React.ChangeEvent<HTMLInputElement | HTMLSelectElement>*/) => void,
    handleSubmit: (e: React.FormEvent) => void,
}

/**
 * 
 * @param initialData 
 * @returns 
 */
function useForm<T>(
    initialData: T, 
): useFormResponse<T> {
    const [data, setData] = useState<T>(initialData);

    const resetForm = (): void => {
        setData(initialData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> /*React.ChangeEvent<HTMLInputElement | HTMLSelectElement>*/): void => {
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