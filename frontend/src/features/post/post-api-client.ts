import ApiClient, { ApiClientResponse } from "../../api/ApiClient";
import Post from "../../types/Post";

// MOCK API ENDPOINTS
import { getAllPosts, getPostById, getPostByCategories } from "../../api/post-api";
import MockError from "../../common/errors/MockError";

class ForumPostClient extends ApiClient<Post> {
    async getAll() {
        try {
            // TODO: replace with axios GET call
            // const data = await axios.get(")
            const data = await getAllPosts();

            return {
                type: "success",
                data: data,
                error: "",
            } as ApiClientResponse<Post[]>;

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
            } as ApiClientResponse<Post[]>;
        }
    }

    async getById(postId: number) {
        try {
            // TODO: replace with axios GET call
            // const data = await axios.get("API_BASE_URL/post/postId")

            console.log("forumPostClient.getById(id)", postId);
            const data = await getPostById(postId);

            return {
                type: "success",
                data: data,
                error: "",
            } as ApiClientResponse<Post>;

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
            } as ApiClientResponse<Post>;
        }
    }

    async getByCategories(categories: string[]) {
        try {
            // TODO: replace with axios
            const data = await getPostByCategories(categories);
            
            return {
                type: "success",
                data: data,
                error: "",
            } as ApiClientResponse<Post[]>;
            
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
            } as ApiClientResponse<Post[]>;
        }
    }
}

const forumPostClient = new ForumPostClient("");
export default forumPostClient;