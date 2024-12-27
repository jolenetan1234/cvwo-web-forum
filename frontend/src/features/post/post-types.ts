export default interface Post {
    id: string;
    title: string;
    content: string;
    category_id: string;
    user_id: string;
}

/**
 * @interface CreatePostData - The shape of the CreatePostForm data object.
 * @property {string} title - The title of the post.
 * @property {string} content - The content of the post.
 * @property {number} category
 */
export interface CreatePostData {
    title: string;
    content: string;
    category_id: string;
}