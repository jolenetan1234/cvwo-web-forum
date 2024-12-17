import ApiClient, { ApiClientResponse } from "../../api/ApiClient";
import User from "../../types/User";

// MOCK API ENDPOINTS
import { getUserById } from "../../api/user-api";
import MockError from "../../common/errors/MockError";

class UserClient extends ApiClient<User> {
    // unauthorised users should NOT have access to this. 
    // Hence, for now I'm having this simply return an empty array.
    async getAll() {
        try {
            const data: User[] = [];

            return {
                type: "success",
                data: data,
                error: ""
            } as ApiClientResponse<User[]>;

        } catch (err: any) {
            let message;
            // TODO: Replace MockError with AxiosError or something
            if (err instanceof MockError) {
                message = err.message;
            } else {
                message = "An unknown error occurred.";
            } 

            return {
                type: "error",
                data: null,
                error: message,
            } as ApiClientResponse<User[]>;
        }
    }

    async getById(userId: number) {
        try {
            // TODO: replace with axios GET call
            // const data = await axios.get("API_BASE_URL/user/userId")

            const data = await getUserById(userId);

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
}

const userClient = new UserClient("");
export default userClient;