/**
 * @interface FormField
 * @property {"input" | "select"} fieldType - The type of the field.
 * @property {string} placeholder - The placeholder text of a field.
 * @property {string} name - The name of a field. Should be the same as the name of its attribute in the form data.
 * @property {boolean} required? - The boolean flag indicating whether the field is required or not.
 * @property {string} type? - The type of a field. (Eg. "password")
 */
export interface FormField {
    fieldType: "input" | "select",
    placeholder: string,
    name: string,
    required: boolean,
    type?: string,
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
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
    handleSubmit: (e: React.FormEvent) => void,
}