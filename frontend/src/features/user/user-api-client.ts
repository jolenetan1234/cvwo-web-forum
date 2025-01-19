import axios, { AxiosError } from "axios";
import ApiClient, { ApiClientResponse } from "../../api/ApiClient";

// types
import User, { LoginData, LoginResponse, SignUpData } from "./user-types";
import { ApiResponse } from "../../common/types/common-types";

class UserClient extends ApiClient<User> {
    // unauthorised users should NOT have access to this. 
    // Hence, for now I'm having this simply return an empty array.
    async getAll(): Promise<ApiClientResponse<User[]>> {
        try {
            const data: User[] = [];

            return {
                type: "success",
                data: data,
                error: ""
            } as ApiClientResponse<User[]>;

        } catch (err: any) {
            const message = err.message ?? 'Failed to GET User: An unknown error occurred.';

            return {
                type: "error",
                data: null,
                error: message,
            } as ApiClientResponse<User[]>;
        }
    }

    async getById(userId: string): Promise<ApiClientResponse<User>> {
        try {
            const res = await axios.get<ApiResponse<User>>(
                `${import.meta.env.VITE_API_URL}/users/${userId}`
            )
            const apiResponse = res.data;
            const data = apiResponse.data;

            console.log("[userClient.getById] Successfully GET user by id", res);

            return {
                type: "success",
                data: data,
                error: "",
            } as ApiClientResponse<User>;

        } catch (err: any) {
            let message;

            if (err instanceof AxiosError) {
                message = err.response?.data.error ?? 'Failed to get user: An unexpected error occured.';
            } else {
                message = 'Failed to get user: An unexpected error occured.';
            }

            console.log("[userClient.getById] Failed to GET user", err);
           
            return {
                type: "error",
                data: null,
                error: message,
            };
        }
    }

    async post(content: SignUpData): Promise<ApiClientResponse<User>> {
        try {
            // TODO: replace with axios POST call
            // POST API_/BASE_URL/user
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/users`, content)
            // const res = await userApi.createUser(content);
            const apiResponse: ApiResponse<User> = res.data;

            const user: User = {
                id: apiResponse.data?.username,
                username: apiResponse.data?.username,
            } 

            console.log("[userClient.post] Successfully CREATE user", user);

            return {
                type: "success",
                data: user,
                error: "",
            } as ApiClientResponse<User>;

        } catch (err: any) {
            let message;

            console.log("[userClient.post] Failed to create user", err);

            if (err instanceof AxiosError) {
                message = err.response?.data.error ?? 'Failed to create user: An unknown error occured.';
            } else {
                message = 'Failed to create user: An unknown error occured.';
            }

            return {
                type: "error",
                data: null,
                error: message,
            } as ApiClientResponse<User>;
        }
    }
    
    // TODO: refactor to just include user
    async login(credentials: LoginData): Promise<ApiClientResponse<LoginResponse>> {
        try {
            const res = await axios.post<ApiResponse<User>>(`${import.meta.env.VITE_API_URL}/login`, credentials, { withCredentials: true })
            const apiResponse = res.data;
            const user = apiResponse.data;

            console.log("[userClient.logout] Successfully login", res);

            return {
                type: "success",
                data: {
                    user: user,
                    token: "fake-jwt-token"
                },
                error: "",
            };

        } catch (err: any) {
            let message;

            if (err instanceof AxiosError) {
                message = err.response?.data.error ?? 'Failed to login user: An unknown error occured.';
            } else {
                message = 'Failed to create user: An unknown error occured.';
            }
           
            return {
                type: "error",
                data: null,
                error: message,
            };
        }
    }

    async logout(): Promise<ApiClientResponse<null>> {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/logout`, {
                withCredentials: true
            });

            console.log("[userClient.logout] Successfully log out", res);

            return {
                type: "success",
                data: null,
                error: "",
            }
        } catch (err: any) {
            let message;

            if (err instanceof AxiosError) {
                message = err.response?.data.error ?? 'Failed to logout: An unknown error occured.';
            } else {
                message = 'Failed to logout: An unknown error occured.';
            }
           
            return {
                type: "error",
                data: null,
                error: message,
            };
        }
    }
}

const userClient = new UserClient();
export default userClient;