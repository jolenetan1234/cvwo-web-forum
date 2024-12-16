abstract class ApiClient<T> {
    protected token: string;

    constructor(token: string) {
        this.token = token;
    }

    abstract get(id: any): Promise<ApiModel<T>>
    abstract getAll(): Promise<ApiModel<T[]>>
}

export interface ApiModel<T> {
    type: "error" | "success",
    data: T,
    error: string
}

export default ApiClient