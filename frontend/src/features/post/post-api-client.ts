import ApiClient, { ApiClientResponse } from "../../api/ApiClient";
import Post from "../../types/Post";
import MockError from "../../common/errors/MockError";

// MOCK API ENDPOINTS
import { getAllPosts, getPostById, getPostByCategories } from "../../api/post-api";

class ForumPostClient extends ApiClient<Post> {
    async getAll(): Promise<ApiClientResponse<Post[]>> {
        try {
            // TODO: replace with axios GET call
            // const data = await axios.get(")
            const data = await getAllPosts();

            return {
                type: "success",
                data: data,
                error: "",
            };

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
            };
        }
    }

    async getById(postId: number): Promise<ApiClientResponse<Post>> {
        try {
            // TODO: replace with axios GET call
            // const data = await axios.get("API_BASE_URL/post/postId")

            console.log("forumPostClient.getById(id)", postId);
            const data = await getPostById(postId);

            return {
                type: "success",
                data: data,
                error: "",
            };

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
            };
        }
    }

    async getByCategories(categories: number[]): Promise<ApiClientResponse<Post[]>> {
        try {
            // TODO: replace with axios
            const data = await getPostByCategories(categories);
            console.log("[forumPostClient.getPostByCategories", data);
            
            return {
                type: "success",
                data: data,
                error: "",
            };
            
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
            };
        }
    }
}

const forumPostClient = new ForumPostClient("");
export default forumPostClient;