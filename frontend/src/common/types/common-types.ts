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
 * The shape of the backend API response.
 */
export interface ApiResponse<T> {
    status: "success" | "error",
    data: T,
    error: string,
}