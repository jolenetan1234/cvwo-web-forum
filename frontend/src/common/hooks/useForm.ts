import { useState } from "react";

interface useFormResponse<S> {
    data: S,
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
    resetForm: () => void,
}

function useForm<T>(
    initialData: T, 
): useFormResponse<T> {
    const [data, setData] = useState<T>(initialData);

    const resetForm = (): void => {
        setData(initialData);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        // sets state of `data`

        setData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }))
    }

    return {
        data,
        handleChange,
        resetForm,
    }
}

export default useForm;