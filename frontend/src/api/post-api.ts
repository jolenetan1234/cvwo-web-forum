// NOTE: this is only for development purposes.
// USELESS once backend is set up.

import MockError from "../common/errors/MockError";
import Post from "../types/Post"

// HARD CODED
const posts = [
    {
        id: 1,
        title: "My first Lego Block",
        content: "I love Lego",
        category: "Rant",
        userId: 1,
    },
    {
        id: 2,
        title: "I stubbed my toe",
        content: "I banged it against the table :(",
        category: "Daily", 
        userId: 1,
    }
]

/**
 * Returns all posts in the database. 
 * @returns {Post[]} An array of Post.
 */
export const getAllPosts = async (): Promise<Post[]> => {
    return posts;
}

/**
 * Filters and returns a Post, based on the `postId`. 
 * @param {number} postId - ID of the Post.
 * @returns {Post} - The Post with ID == `postID`.
 */
export const getPostById = async (postId: number): Promise<Post> => {
    // Responsibility of error handling should fall on the caller.
    const post = posts.find(p => p.id === postId);

    // mock 404 error
    if (!post) {
        throw new MockError("404: Post Not Found");
    } else {
        return post;
    }
}

export const getPostByCategories = async (categories: string[]): Promise<Post[]> => {
    
    return posts.filter(post => categories.includes(post.category));
} 