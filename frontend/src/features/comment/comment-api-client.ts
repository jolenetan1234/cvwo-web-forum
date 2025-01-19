import ApiClient, { ApiClientResponse } from "../../api/ApiClient";
// import Comment from "../../types/Comment";
import Comment, { NewComment, UpdatedComment } from "./comment-types";

// MOCK API ENDPOINTS
import MockError from "../../common/errors/MockError";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "../../common/types/common-types";

class CommentClient extends ApiClient<Comment> {
    async getAll() {
        try {
            const res = await axios.get<ApiResponse<Comment[]>>(`${import.meta.env.VITE_API_URL}/comments`)
            const apiResponse = res.data;
            const comments = apiResponse.data;

            console.log("[commentClient.getAll] Successfully GET all comments", res);
            return {
                type: "success",
                data: comments,
                error: "",
            } as ApiClientResponse<Comment[]>;

        } catch (err: any) {
            let message;

            if (err instanceof AxiosError) {
                message = err.response?.data.error ?? 'Failed to get comments: An unexpected error occured.';
            } else {
                message = 'Failed to get comments: An unexpected error occured.';
            }
           
            console.log("[commentClient.All] Failed to GET all comments", err);

            return {
                type: "error",
                data: null,
                error: message,
            } as ApiClientResponse<Comment[]>;
        }
    }

    async getById(commentId: string) {
        try {
            // TODO: replace with axios GET call
            // const data = await axios.get("API_BASE_URL/comment/commentId")
            // Backend has not implemented getCommentById yet (because frontend doesn't actually need it).
            // So for now just hard code a comment.
            const comment: Comment = {
                id: commentId,
                content: "hi",
                post_id: "1",
                user_id: "1",
                created_at: Date(),
                updated_at: Date(),
            }
            
            return {
                type: "success",
                data: comment,
                error: "",
            } as ApiClientResponse<Comment>;

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
            } as ApiClientResponse<Comment>;
        }
    }
    
    async getByPostId(postId: string) {
        try {
            const res = await axios.get<ApiResponse<Comment[]>>(`${import.meta.env.VITE_API_URL}/posts/${postId}/comments`);
            const apiResponse = res.data;
            const comments = apiResponse.data;

            console.log("[commentClient.getByPostId] Successfully GET comments by post id", res);
           
            return {
                type: "success",
                data: comments,
                error: "",
            } as ApiClientResponse<Comment[]>;
        } catch (err: any) {
            let message;

            if (err instanceof AxiosError) {
                message = err.response?.data.error ?? 'Failed to get comments: An unexpected error occured.';
            } else {
                message = 'Failed to get comments: An unexpected error occured.';
            }
           
            console.log("[commentClient.getByPostId] Failed to GET comments by post id", err);

            return {
                type: "error",
                data: null,
                error: message,
            };
        }
    }

    async post(formData: NewComment): Promise<ApiClientResponse<Comment>> {
        try {
            const postId = formData.post_id;
            const res = await axios.post<ApiResponse<Comment>>(
                `${import.meta.env.VITE_API_URL}/posts/${postId}/comments`,
                formData,
                { withCredentials: true }
            )
            const apiResponse = res.data;
            const comment = apiResponse.data;

            console.log("[commentClient.post] Successfully CREATE comment", res);

            return {
                type: 'success',
                data: comment,
                error: '',
            }

        } catch (err: any) {
            let message;

            if (err instanceof AxiosError) {
                message = err.response?.data.error ?? 'Failed to create comment: An unexpected error occured.';
            } else {
                message = 'Failed to create comment: An unexpected error occured.';
            }
           
            console.log("[commentClient.post] Failed to CREATE comment", err);

            return {
                type: "error",
                data: null,
                error: message,
            };
        };
    }

    async put(commentId: string, formData: UpdatedComment): Promise<ApiClientResponse<Comment>> {
        try {
            const res = await axios.put<ApiResponse<Comment>>(
                `${import.meta.env.VITE_API_URL}/comments/${commentId}`,
                formData,
                { withCredentials: true },
            )
            const apiResponse = res.data;
            const comment = apiResponse.data;

            console.log("[commentClient.put] Successfully UPDATE comment", res);

            return {
                type: 'success',
                data: comment,
                error: '',
            };
        } catch (err: any) {
            let message;

            if (err instanceof AxiosError) {
                message = err.response?.data.error ?? 'Failed to update comment: An unexpected error occured.';
            } else {
                message = 'Failed to update comment: An unexpected error occured.';
            }
           
            console.log("[commentClient.put] Failed to UPDATE comment", err);

            return {
                type: "error",
                data: null,
                error: message,
            };
        }

    }

    async delete(commentId: string): Promise<ApiClientResponse<Comment>> {    
        try {

            const res = await axios.delete<ApiResponse<Comment>>(
                `${import.meta.env.VITE_API_URL}/comments/${commentId}`,
                { withCredentials: true },
            );
            const apiResponse = res.data;
            const comment = apiResponse.data;

            console.log('[commentClient.delete] Successfully DELETE comment', res)
           
            return {
                type: "success",
                data: comment,
                error: "",
            } as ApiClientResponse<Comment>;

        } catch (err: any) {
            let message;

            if (err instanceof AxiosError) {
                message = err.response?.data.error ?? 'Failed to delete comment: An unexpected error occured.';
            } else {
                message = 'Failed to delete comment: An unexpected error occured.';
            }
           
            console.log("[commentClient.delete] Failed to DELETE comment", err);

            return {
                type: "error",
                data: null,
                error: message,
            };
        }
    }
}

const commentClient = new CommentClient();
export default commentClient;