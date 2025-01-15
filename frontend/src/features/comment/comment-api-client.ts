import ApiClient, { ApiClientResponse } from "../../api/ApiClient";
// import Comment from "../../types/Comment";
import Comment, { NewComment, UpdatedComment } from "./comment-types";

// MOCK API ENDPOINTS
import { createComment, deleteComment, getAllComments, getCommentById, getCommentsByPostId, updateComment } from "../../api/comment-api";
import MockError from "../../common/errors/MockError";
import axios from "axios";
import { ApiResponse } from "../../common/types/common-types";

class CommentClient extends ApiClient<Comment> {
    async getAll() {
        try {
            // TODO: replace with axios GET call
            // const data = await axios.get()
            const res = await getAllComments();
            
            const data = res.map(comment => ({
                ...comment,
                id: comment.id.toString(),
                post_id: comment.post_id.toString(),
                user_id: comment.user_id.toString()
            }))           

            return {
                type: "success",
                data: data,
                error: "",
            } as ApiClientResponse<Comment[]>;

        } catch (err: any) {
            let message;
            // TODO: Replace MockError with AxiosError or something
            if (err instanceof MockError) {
                message = err.message;
            } else {
                message = "An unknown error occurred";
            }

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
            // TODO: replace with axios GET call
            // const data =a await axios.get("API_BASE_URL/comment/?postId=postId")
            // const res = await getCommentsByPostId(parseInt(postId));
            
            // const data = res.map(comment => ({
            //     ...comment,
            //     id: comment.id.toString(),
            //     post_id: comment.post_id.toString(),
            //     user_id: comment.user_id.toString(),
            // }));
            const res = await axios.get<ApiResponse<Comment[]>>(`${import.meta.env.VITE_API_URL}/comments?postId=${postId}`);
            const apiResponse = res.data;
            const comments = apiResponse.data;
           
            return {
                type: "success",
                data: comments,
                error: "",
            } as ApiClientResponse<Comment[]>;
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
            } as ApiClientResponse<Comment[]>;
        }
    }

    async post(formData: NewComment, token: string): Promise<ApiClientResponse<Comment>> {
        try {

            // check for token
            if (!token) {
                return {
                    type: 'error',
                    data: null,
                    error: 'Failed to CREATE comment: User unauthorised',
                };
            };

            // format data to fit backend requirements
            const sentData = {
                content: formData.content,
                post_id: parseInt(formData.post_id),
            }

            // TODO: replace with actual API call and pass in token
            const res = await createComment(sentData);
            
            // TODO: reformat data sent from backend (if needed) to match `Comment`.
            const data = {
                ...res,
                id: res.id.toString(),
                post_id: res.post_id.toString(),
                user_id: res.user_id.toString(),
            }

            return {
                type: 'success',
                data: data,
                error: '',
            }

        } catch (err: any) {
            const message = err.message ?? 'Failed to CREATE comment: An unexpected error occurred.'

            return {
                type: 'error',
                data: null,
                error: message,
            };
        };
    }

    async put(commentId: string, formData: UpdatedComment, token: string): Promise<ApiClientResponse<Comment>> {
        try {
            if (!token) {
                return {
                    type: 'error',
                    data: null,
                    error: 'Failed to DELETE comment: User unauthorised',
                };
            }

            // Format data to suit backend requirements
            const sentData = {
                ...formData,
            };

            // TODO: send PUT req to API_BASE_URL/comments/${commentId}
            // And include token in request headers.
            const res = await updateComment(sentData, parseInt(commentId));

            // Format BackendComment into Comment
            const data = {
                ...res,
                id: res.id.toString(),
                post_id: res.post_id.toString(),
                user_id: res.user_id.toString(),
            };

            return {
                type: 'success',
                data: data,
                error: '',
            };
        } catch (err: any) {
            const message = err.message ?? 'Failed to UPDATE comment: An unexpected error occurred.';

            return {
                type: 'error',
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