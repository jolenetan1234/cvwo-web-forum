import axios, { AxiosError } from "axios";
import ApiClient, { ApiClientResponse } from "../../api/ApiClient";

// MOCK API ENDPOINTS
import userApi from "../../api/user-api";
import MockError from "../../common/errors/MockError";

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
            // TODO: replace with axios GET call
            // const data = await axios.get("API_BASE_URL/user/userId")
            const data = await userApi.getUserById(parseInt(userId));

            return {
                type: "success",
                data: data,
                error: "",
            } as ApiClientResponse<User>;

        } catch (err: any) {
            let message;
            // TODO: replace MockError with AxiosError or something
            if (err instanceof MockError) {
                message = err.message;
            } else {
                message = "An unknown error occurred.";
            }

            return {
                type: "error",
                data: null,
                error: message,
            } as ApiClientResponse<User>;
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
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, credentials, { withCredentials: true })

            // const apiResponse: ApiResponse<LoginResponse> = res.data;
            const apiResponse: ApiResponse<User> = res.data;

            const user = apiResponse.data;
            // const loginResponse = apiResponse.data;

            // const loginResponse = await userApi.login(credentials);

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

const userClient = new UserClient("");
export default userClient;