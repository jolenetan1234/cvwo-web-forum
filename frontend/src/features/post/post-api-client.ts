import ApiClient, { ApiClientResponse } from "../../api/ApiClient";

// types
import Post, { NewPost, UpdatedPost } from "./post-types";
import MockError from "../../common/errors/MockError";
import { UserState } from "../user/user-slice";

// MOCK API ENDPOINTS
import { getAllPosts, getPostById, getPostByCategories, createPost, updatePost, deletePost } from "../../api/post-api";
import { useSelector } from "react-redux";
import { selectUserToken } from "../user/user-slice";
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

    // UNUSED; can delete.
    /*
    async getById(postId: string): Promise<ApiClientResponse<Post>> {
        try {
            // console.log("forumPostClient.getById(id)", postId);
            // const res = await getPostById(parseInt(postId));
            // const data = {
            //     ...res,
            //     id: res.id.toString(),
            //     category_id: res.category_id.toString(),
            //     user_id: res.user_id.toString(),
            // }
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
        */

    /*
    // UNUSED; CAN DELETE.
    async getByCategories(categories: string[]): Promise<ApiClientResponse<Post[]>> {
        try {
            // if no categories, simply return everything.
            let res;
            if (categories.length <= 0) {
                // TODO: replace with axios
               res = await getAllPosts();
            } else {
                // TODO: replace with axios
                res = await getPostByCategories(categories.map(cat => parseInt(cat)));
            }
            
            const data = res.map(post => ({
                ...post,
                id: post.id.toString(),
                category_id: post.category_id.toString(),
                user_id: post.user_id.toString(),
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
        */

    async post(newPost: NewPost, token: string): Promise<ApiClientResponse<Post>> {
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

    async put(updatedPost: UpdatedPost, postId: string, token: string): Promise<ApiClientResponse<Post>> {
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

    async delete(postId: string, token: string): Promise<ApiClientResponse<Post>> {
        try {
            const res = await axios.delete(
                `${import.meta.env.VITE_API_URL}/posts/${postId}`,
                { withCredentials: true, },
            );
            // Extract API response from axios
            const apiResponse: ApiResponse<Post> = res.data;
            const data = apiResponse.data;

            console.log("[forumPostClient.delete] Successfully DELETE post", res);
            /*
            if (!token) {
                return {
                    type: 'error',
                    data: null,
                    error: 'Failed to DELETE post: User unauthorised',
                };
            };

            // TODO: send actual backend API call.
            const res = await deletePost(parseInt(postId));
            // TODO: check is (res.ok) or something like that
            // If not ok, return failed response

            // mock the extraction of the data we need
            const backendPost = res;            
            const data = {
                ...backendPost,
                id: backendPost.id.toString(),
                category_id: backendPost.category_id.toString(),
                user_id: backendPost.user_id.toString(),
            };
            */

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

const forumPostClient = new ForumPostClient("");
export default forumPostClient;