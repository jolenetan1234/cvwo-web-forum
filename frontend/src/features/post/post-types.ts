/**
 * @interface Post - The shape of a Post object.
 * @property {string} id - The ID of the post.
 * @property {string} title - The title of the post.
 * @property {string} content - The content of the post.
 * @property {string} category_id - The category ID of the post.
 */
export default interface Post {
    id: string;
    title: string;
    content: string;
    category_id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

/**
 * @interface NewPost - The shape of the data needed to create a new post.
 * @property {string} title - The title of the post.
 * @property {string} content - The content of the post.
 * @property {string} category_id - The category ID of the post.
 */
export interface NewPost {
    title: string;
    content: string;
    category_id: string;
}

/**
 * @interface UpdatedPost - The shape of the data needed to updated a post.
 * @property {string} title - The title of the post.
 * @property {string} content - The content of the post.
 * @property {string} category_id - The category ID of the post.
 */
export interface UpdatedPost {
    title: string;
    content: string;
    category_id: string;
}