// NOTE: this is only for development purposes.
// USELESS once backend is set up.

import Comment from "../types/Comment";
import NotFoundError from "../common/errors/MockError";

// HARDCODED
const COMMENTS = [
    {
        id: 1,
        content: "Who even likes lego nowadays",
        postId: 1,
        userId: 2,
    },
    {
        id: 2,
        content: "haha loser",
        postId: 2,
        userId: 2,
    },
    {
        id: 3,
        content: "hope u step on legos",
        postId: 1,
        userId: 3,
    }
]

export const getAllComments = async (): Promise<Comment[]> => {
    // TODO: replace with API call
    return COMMENTS;
}

/**
 * Filters and returns an array of comments belonging to a post. 
 * @param {number} postId - ID of the Post.
 * @returns {Comment[]} An array of comments belonging to the post.
 */
export const getCommentsByPostId = async (postId: number): Promise<Comment[]> => {
    // TODO: replace with API call
    const comments = COMMENTS.filter(c => c.postId === postId);

    return comments; 
}

/**
 * Filters and returns a Comment, based on the `commentID`.
 * @param {number} commentId - ID of the Comment.
 * @returns {Comment} The Comment with ID == `commentID`.
 */
export const getCommentById = async (commentId: number): Promise<Comment> => {
    // TODO: replace with API call
    const comment = COMMENTS.find(c => c.id === commentId);

    // if not found, throw error
    if (!comment) {
        throw new NotFoundError("404: Comment Not Found");
    } else {
        return comment;
    }
}