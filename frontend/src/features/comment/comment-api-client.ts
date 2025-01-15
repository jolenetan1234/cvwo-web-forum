import ApiClient, { ApiClientResponse } from "../../api/ApiClient";
// import Comment from "../../types/Comment";
import Comment, { NewComment, UpdatedComment } from "./comment-types";

// MOCK API ENDPOINTS
import { createComment, deleteComment, getAllComments, getCommentById, getCommentsByPostId, updateComment } from "../../api/comment-api";
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
            const res = await getCommentById(parseInt(commentId));
            
            const data = {
                ...res,
                id: res.id.toString(),
                post_id: res.post_id.toString(),
                user_id: res.user_id.toString(),
            }

            return {
                type: "success",
                data: data,
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

    async post(formData: NewComment, token: string): Promise<ApiClientResponse<Comment>> {
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

    async put(commentId: string, formData: UpdatedComment, token: string): Promise<ApiClientResponse<Comment>> {
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

    async delete(commentId: string, token: string): Promise<ApiClientResponse<Comment>> {    
        try {
            if (!token) {
                return {
                    type: 'error',
                    data: null,
                    error: 'Failed to DELETE comment: User unauthorised',
                };
            };

            // TODO: replace with actual API call and pass in token
            const res = await deleteComment(parseInt(commentId));
            const deletedComment = res;

            // TODO: check if res is ok. if not, return error
            // format data
            const data = {
                ...deletedComment,
                id: deletedComment.id.toString(),
                post_id: deletedComment.post_id.toString(),
                user_id: deletedComment.user_id.toString(),
            };

            console.log('[commentClient.delete] Successfully DELETE post', data)
           
            return {
                type: "success",
                data: data,
                error: "",
            } as ApiClientResponse<Comment>;

        } catch (err: any) {
            const message = err.message || 'Failed to DELETE comment: An unexpected error occured.';

            return {
                type: 'error',
                data: null,
                error: message,
            };
        }
    }
}

const commentClient = new CommentClient("");
export default commentClient;