import Post from "../../types/Post"

// HARD CODED
const posts = [
    {
        id: 1,
        title: "My first Lego Block",
        content: "I love Lego",
        category: "Rant",
    },
    {
        id: 2,
        title: "I stubbed my toe",
        content: "I banged it against the table :(",
        category: "Daily", 
    }
]

/**
 * Returns all posts in the database. 
 * @returns {Post[]} An array of Post.
 */
export const getAllPosts = (): Post[] => {
    return posts;
}

/**
 * Filters and returns a Post, based on the `postId`. 
 * @param {number} postId - ID of the Post.
 * @returns {Post} - The Post with ID == `postID`.
 */
export const getPostById = (postId: number): Post => {
    // Responsibility of error handling should fall on the caller.
    const post = posts.find(p => p.id === postId);

    // if not found, throw error
    if (!post) {
        throw new Error(`Post with ID ${postId} not found.`);
    } else {
        return post;
    }
}