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
}

export default ApiClient;