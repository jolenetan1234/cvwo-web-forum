// NOTE: this is only for development purposes.
// USELESS once backend is set up.
// mock backend; hence, here the types expected will follow that in the backend.

import MockError from "../common/errors/MockError";

/**
 * To mock the case where backend id is number instead of string.
 */
interface BackendCreatePostData {
    title: string;
    content: string;
    category_id: number;
    user_id: number;
}

interface BackendUpdatePostData {
    title: string;
    content: string;
    category_id: number;
}

interface BackendPost {
    id: number;
    title: string;
    content: string;
    category_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
}

// HARD CODED
const posts: BackendPost[] = [
    {
        id: 1,
        title: "My first Lego Block",
        content: "I love Lego",
        category_id: 1,
        user_id: 1,
        created_at: Date(),
        updated_at: Date(),
    },
    {
        id: 2,
        title: "I stubbed my toe",
        content: "I banged it against the table :(",
        category_id: 2,
        user_id: 1,
        created_at: Date(),
        updated_at: Date(),
    }
]

/**
 * Returns all posts in the database. 
 * @returns {Post[]} An array of Post.
 */
export const getAllPosts = async (): Promise<BackendPost[]> => {
    return posts;
}

/**
 * Filters and returns a Post, based on the `postId`. 
 * @param {number} postId - ID of the Post.
 * @returns {Post} - The Post with ID == `postID`.
 */
export const getPostById = async (postId: number): Promise<BackendPost> => {
    // Responsibility of error handling should fall on the caller.
    const post = posts.find(p => p.id === postId);

    // mock 404 error
    if (!post) {
        throw new MockError("404: Post Not Found");
    } else {
        return post;
    };
}

export const getPostByCategories = async (categories: number[]): Promise<BackendPost[]> => {
    const res = posts.filter(post => categories.includes(post.category_id));
    return res;
}

/**
 * When integrating with the actual API,
 * The data to be sent should also follow this same format.
 * But ofc can have authorisation headers and stuff.
 * 
 * FOR NOW, I will hard code a userId.
 * But during actual backend implementation => userId to be encoded
 * WITHIN THE AUTHORISATION TOKEN.
 */
export const createPost = async (data: BackendCreatePostData): Promise<BackendPost> => {
    // HARDCODED
    const userId = data.user_id;
    const newPost = {
        id: posts.length + 1,
        title: data.title,
        content: data.content,
        category_id: data.category_id,
        user_id: userId,
    };

    // But in the actual API, I'll manipulate the db
    return newPost;
}

/**
 * Mock API endpoint for `PUT API_BASE_URL/posts/:postId
 * @param data 
 * @returns 
 */
export const updatePost = async (data: BackendUpdatePostData, postId: number): Promise<BackendPost> => {
    const post = posts.find(p => p.id === postId);

    if (!post) {
        // mock an error
        throw {
            status: 404,
            message: "Failed to update post: Post does not exist",
        };
    } else {
        const updatedPost = {
            ...post,
            title: data.title,
            content: data.content,
            category_id: data.category_id,
        };

        return updatedPost;
    }

    // But in the actual API, I'll manipulate the db
}

export const deletePost = async (postId: number): Promise<BackendPost> => {
    const post = posts.find(p => p.id === postId);

    if (!post) {
        // mock an error
        throw {
            status: 404,
            message: "Failed to DELETE post: Post does not exist",
        };
    } else {
        // return the deleted post
        return post;
    }
}