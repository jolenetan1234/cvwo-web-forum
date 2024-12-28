import ApiClient, { ApiClientResponse } from "../../api/ApiClient";

// types
import Post, { CreatePostData } from "./post-types";
import MockError from "../../common/errors/MockError";
import { UserState } from "../user/user-slice";

// MOCK API ENDPOINTS
import { getAllPosts, getPostById, getPostByCategories, createPost } from "../../api/post-api";
import { useSelector } from "react-redux";
import { selectUserToken } from "../user/user-slice";

class ForumPostClient extends ApiClient<Post> {
    async getAll(): Promise<ApiClientResponse<Post[]>> {
        try {
            // TODO: replace with axios GET call
            // const data = await axios.get(")
            const res = await getAllPosts();
            
            const data = res.map(post => ({
                ...post,
                id: post.id.toString(),
                category_id: post.category_id.toString(),
                user_id: post.user_id.toString(),
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
            const res = await getPostById(parseInt(postId));
            const data = {
                ...res,
                id: res.toString(),
                category_id: res.category_id.toString(),
                user_id: res.user_id.toString(),
            }

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
                id: post.toString(),
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

    async post(createPostData: CreatePostData, userToken: UserState["token"]): Promise<ApiClientResponse<Post>> {
        try {
            // reformat data to send to backend
            // TODO: reformat based on actual backend needs (Eg. send token in header,)
            // const token = useSelector(selectUserToken); // CANNOT! Hooks can only be called WITHIN a component.
            // console.log("[postApi.post] userToken", userToken);

            const sentData = {
                ...createPostData,
                category_id: parseInt(createPostData.category_id),
            };

            // TODO: replace with actual API call
            const res = await createPost(sentData);

            // TODO: reformat data (if needed) to match `Post`.
            const data = {
                ...res,
                id: res.id.toString(),
                category_id: res.category_id.toString(),
                user_id: res.user_id.toString(),
            };

            return {
                type: "success",
                data: data,
                error: "",
            }
        } catch (err: any) {
            let message;

            message = err;
            /*
            if (err.status === 401) {
                message = err.message;
            } else {
                message = "An unknown error occurred.";
            };
            */

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