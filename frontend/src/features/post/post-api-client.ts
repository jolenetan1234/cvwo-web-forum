import ApiClient, { ApiClientResponse } from "../../api/ApiClient";

// types
import Post, { NewPost, UpdatedPost } from "./post-types";

// MOCK API ENDPOINTS
import axios, { AxiosError } from "axios";
import { ApiResponse } from "../../common/types/common-types";

class ForumPostClient extends ApiClient<Post> {
    async getAll(): Promise<ApiClientResponse<Post[]>> {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`);
            const apiResponse: ApiResponse<Post[]> = res.data;
            const data = apiResponse.data;

            console.log("[forumPostClient.getAll] Successfully GET all posts", res);
            
            return {
                type: "success",
                data: data,
                error: "",
            };

        } catch (err: any) {
            let message;

            if (err instanceof AxiosError) {
                message = err.response?.data.error ?? 'Failed to get all posts: An unexpected error occured.';
            } else {
                message = 'Failed to get all posts: An unexpected error occured.';
            }

            console.log("[forumPostClient.getAll] Failed to GET all posts", err);
           
            return {
                type: "error",
                data: null,
                error: message,
            };
        }
    }

    async getById(postId: string): Promise<ApiClientResponse<Post>> {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${postId}`);
            const apiResponse: ApiResponse<Post> = res.data;
            const data = apiResponse.data;

            console.log("[forumPostClient.getById] Successfully get post by id", res);

            return {
                type: "success",
                data: data,
                error: "",
            };

        } catch (err: any) {
            let message;

            if (err instanceof AxiosError) {
                message = err.response?.data.error ?? 'Failed to logout: An unknown error occured.';
            } else {
                message = 'Failed to logout: An unknown error occured.';
            }

            console.log("[forumPostClient.getbyId] Failed to get post by id", err);
           
            return {
                type: "error",
                data: null,
                error: message,
            };
        }
    }

    async post(newPost: NewPost): Promise<ApiClientResponse<Post>> {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, { withCredentials: true });
            const apiResponse: ApiResponse<Post> = res.data;
            const data = apiResponse.data

            console.log("[forumPostClient.post] Successfully CREATE new post", res);

            return {
                type: "success",
                data: data,
                error: "",
            }
        } catch (err: any) {
            let message;

            if (err instanceof AxiosError) {
                message = err.response?.data.error ?? 'Failed to update post: An unknown error occured.';
            } else {
                message = 'Failed to update post: An unexpected error occured.';
            }
           
            console.log("[forumPostClient.post] Failed to CREATE post", err);

            return {
                type: "error",
                data: null,
                error: message,
            };
        }
    }

    async put(updatedPost: UpdatedPost, postId: string): Promise<ApiClientResponse<Post>> {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/posts/${postId}`, 
                updatedPost,
                { withCredentials: true },
            );
            const apiResponse: ApiResponse<Post> = res.data;
            const data = apiResponse.data;

            console.log("[forumPostClient.post] Successfully UPDATE post", res);

            return {
                type: 'success',
                data: data,
                error: "",
            }
        } catch (err: any) {
            let message;

            if (err instanceof AxiosError) {
                message = err.response?.data.error ?? 'Failed to update post: An unknown error occured.';
            } else {
                message = 'Failed to update post: An unexpected error occured.';
            }
           
            console.log("[forumPostClient.put] Failed to UPDATE post", err);

            return {
                type: "error",
                data: null,
                error: message,
            };
        }
    }

    async delete(postId: string): Promise<ApiClientResponse<Post>> {
        try {
            const res = await axios.delete(
                `${import.meta.env.VITE_API_URL}/posts/${postId}`,
                { withCredentials: true, },
            );
            // Extract API response from axios
            const apiResponse: ApiResponse<Post> = res.data;
            const data = apiResponse.data;

            console.log("[forumPostClient.delete] Successfully DELETE post", res);

            return {
                type: 'success',
                data: data,
                error: '',
            };
        } catch (err: any) {
            let message;

            if (err instanceof AxiosError) {
                message = err.response?.data.error ?? 'Failed to delete post: An unknown error occured.';
            } else {
                message = 'Failed to delete post: An unexpected error occured.';
            }
           
            console.log("[forumPostClient.delete] Failed to DELETE post", err);

            return {
                type: "error",
                data: null,
                error: message,
            };
        }
    }

}

const forumPostClient = new ForumPostClient();
export default forumPostClient;