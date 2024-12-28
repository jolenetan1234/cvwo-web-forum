// THIS SHOULD REMAIN UNCHANGED EVEN WHEN INTEGRATING THE ACTUAL BACKEND.
// Meaning each APIClient is responsible 
// for formatting the fetched data into this foramt.
export interface ApiClientResponse<T> {
    type: "success" | "error",
    data: T | null,
    error: string,
}

abstract class ApiClient<T> {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    abstract getAll(): Promise<ApiClientResponse<T[]>>
    abstract getById(id: any): Promise<ApiClientResponse<T>>
    abstract post(content: any): Promise<ApiClientResponse<T>>
}

export default ApiClient;