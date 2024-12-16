import ApiClient, { ApiModel } from "./ApiClient";
import Post from "../types/Post";
import { getAllPosts, getPostById } from "./post-api";

class ForumPostClient extends ApiClient<Post> {
    async get(id: number) {
        return {
            type: "success",
            data: getPostById(id),
            error: ""
        } as ApiModel<Post>
    }

    async getAll() {
        return {
            type: "success",
            data: getAllPosts(),
            error: ""
        } as ApiModel<Post[]>
    }
}

const forumPostClient = new ForumPostClient("");
export default forumPostClient;

