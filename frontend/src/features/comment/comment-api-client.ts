import ApiClient, { ApiClientResponse } from "../../api/ApiClient";
import Comment from "../../types/Comment";

// MOCK API ENDPOINTS
import { getAllComments, getCommentById, getCommentsByPostId } from "../../api/comment-api";
import MockError from "../../common/errors/MockError";

class CommentClient extends ApiClient<Comment> {
    async getAll() {
        try {
            // TODO: replace with axios GET call
            // const data = await axios.get()
            const data = await getAllComments();
            
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
            const data = await getCommentById(commentId);

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
            const data = await getCommentsByPostId(postId);
           
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