import ApiClient, { ApiClientResponse } from "../../api/ApiClient";

// types
import Post, { CreatePostData, NewPost, UpdatedPost } from "./post-types";
import MockError from "../../common/errors/MockError";
import { UserState } from "../user/user-slice";

// MOCK API ENDPOINTS
import { getAllPosts, getPostById, getPostByCategories, createPost, updatePost, deletePost } from "../../api/post-api";
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
                id: res.id.toString(),
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
            // if no categories, simply return everything.
            let res;
            if (categories.length <= 0) {
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

    async post(newPost: NewPost, token: UserState["token"]): Promise<ApiClientResponse<Post>> {
        try {
            // reformat data to send to backend
            // TODO: reformat based on actual backend needs (Eg. send token in header,)
            // const token = useSelector(selectUserToken); // CANNOT! Hooks can only be called WITHIN a component.
            // console.log("[postApi.post] userToken", userToken);

            const sentData = {
                ...newPost,
                category_id: parseInt(newPost.category_id),
                user_id: parseInt(newPost.user_id),
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
            const message = err.message || "An unexpected error occurred.";

            // message = err;
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

    async put(updatedPost: UpdatedPost, postId: string, token: string): Promise<ApiClientResponse<Post>> {
        // TODO:
        // After backend is actually implemented,
        // IN THE TRY BLOCK, check if `res.ok` or smt like that,
        // and return the respective 'success' / 'error' objects.
        // IN THE CATCH BLOCK, you can keep it as it is here.
        try {
            // TODO: send actual API call,
            // and include token in headers, for backend authentication.
            
            // converting data to match backend requirements
            const sentData  =  {
                ...updatedPost,
                category_id: parseInt(updatedPost.category_id),
            };

            const res = await updatePost(sentData, parseInt(postId));

            // TODO: check res.ok. If not ok, 
            // return { type: 'error', data: null, error: res.message, }
            // Else if ok, just do the same as below.

            // convert to frontend format (where IDs are strings)
            const data = {
                ...res,
                id: res.id.toString(),
                category_id: res.category_id.toString(),
                user_id: res.user_id.toString(),
            }

            return {
                type: 'success',
                data: data,
                error: "",
            }
        } catch (err: any) {
            const message = err.message || "An unexpected error occurred.";

            return {
                type: 'error',
                data: null,
                error: message,
            }
        }
    }

    async delete(postId: string, token: string): Promise<ApiClientResponse<Post>> {
        try {
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

            return {
                type: 'success',
                data: data,
                error: '',
            };
        } catch (err: any) {
            const message = err.message || 'Failed to DELETE post: An unexpected error occurred.';

            return {
                type: 'error',
                data: null,
                error: message,
            };
        }
    }

}

const forumPostClient = new ForumPostClient("");
export default forumPostClient;