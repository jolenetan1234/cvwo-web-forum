import ApiClient, { ApiClientResponse } from "../../api/ApiClient";
// import Comment from "../../types/Comment";
import Comment from "./comment-types";

// MOCK API ENDPOINTS
import { getAllComments, getCommentById, getCommentsByPostId } from "../../api/comment-api";
import MockError from "../../common/errors/MockError";

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

    async getById(commentId: number) {
        try {
            // TODO: replace with axios GET call
            // const data = await axios.get("API_BASE_URL/comment/commentId")
            const res = await getCommentById(commentId);
            
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
    
    async getByPostId(postId: number) {
        try {
            // TODO: replace with axios GET call
            // const data =a await axios.get("API_BASE_URL/comment/?postId=postId")
            const res = await getCommentsByPostId(postId);
            
            const data = res.map(comment => ({
                ...comment,
                id: comment.id.toString(),
                post_id: comment.post_id.toString(),
                user_id: comment.user_id.toString(),
            }));
           
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
                message = "An unknown error occurred.";
            }

            return {
                type: "error",
                data: null,
                error: message,
            } as ApiClientResponse<Comment[]>;
        }
    }
}

const commentClient = new CommentClient("");
export default commentClient;