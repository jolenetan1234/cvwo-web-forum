import { OutlinedInputProps } from "@mui/material";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
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
    handleChange: (e: OutlinedInputProps['onChange'] | SelectInputProps['onChange']) => void,
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
    handleChange: (e: OutlinedInputProps['onChange']) => void,
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

    const handleChange = (e: OutlinedInputProps['onChange'] | SelectInputProps['onChange']): void => {
        setData(prevData => ({
            ...prevData,
            [(e as any).target.name]: (e as any).target.value
        }));
    };

    return {
        data,
        handleChange,
        resetForm,
    };
}

export default useForm;