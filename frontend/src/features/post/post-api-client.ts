import ApiClient, { ApiClientResponse } from "../../api/ApiClient";
// import Post from "../../types/Post";
import Post from "./post-types";
import MockError from "../../common/errors/MockError";

// MOCK API ENDPOINTS
import { getAllPosts, getPostById, getPostByCategories } from "../../api/post-api";

class ForumPostClient extends ApiClient<Post> {
    async getAll(): Promise<ApiClientResponse<Post[]>> {
        try {
            // TODO: replace with axios GET call
            // const data = await axios.get(")
            const res = await getAllPosts();
            
            const data = res.map(post => ({
                ...post,
                id: post.id.toString()
            }));

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

    async getById(postId: string): Promise<ApiClientResponse<Post>> {
        try {
            // TODO: replace with axios GET call
            // const data = await axios.get("API_BASE_URL/post/postId")

            console.log("forumPostClient.getById(id)", postId);
            const data = await getPostById(parseInt(postId));

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

    async getByCategories(categories: string[]): Promise<ApiClientResponse<Post[]>> {
        try {
            // TODO: replace with axios
            const res = await getPostByCategories(categories.map(cat => parseInt(cat)));
            
            const data = res.map(post => ({
                ...post,
                id: post.id.toString(),
            }))
                
            
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