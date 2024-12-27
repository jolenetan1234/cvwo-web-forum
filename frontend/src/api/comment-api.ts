// NOTE: this is only for development purposes.
// USELESS once backend is set up.

import Comment from "../../public/types/Comment";
import NotFoundError from "../common/errors/MockError";

interface BackendComment {
    id: number;
    content: string;
    post_id: number;
    user_id: number;
}

// HARDCODED
const COMMENTS: BackendComment[] = [
    {
        id: 1,
        content: "Who even likes lego nowadays",
        post_id: 1,
        user_id: 2,
    },
    {
        id: 2,
        content: "haha loser",
        post_id: 2,
        user_id: 2,
    },
    {
        id: 3,
        content: "hope u step on legos",
        post_id: 1,
        user_id: 3,
    }
]

export const getAllComments = async (): Promise<BackendComment[]> => {
    return COMMENTS;
}

/**
 * Filters and returns an array of comments belonging to a post. 
 * @param {number} postId - ID of the Post.
 * @returns {Comment[]} An array of comments belonging to the post.
 */
export const getCommentsByPostId = async (postId: number): Promise<BackendComment[]> => {
    // TODO: replace with API call
    const comments = COMMENTS.filter(c => c.post_id === postId);

    return comments; 
}

/**
 * Filters and returns a Comment, based on the `commentID`.
 * @param {number} commentId - ID of the Comment.
 * @returns {Comment} The Comment with ID == `commentID`.
 */
export const getCommentById = async (commentId: number): Promise<BackendComment> => {
    // TODO: replace with API call
    const comment = COMMENTS.find(c => c.id === commentId);

    // if not found, throw error
    if (!comment) {
        throw new NotFoundError("404: Comment Not Found");
    } else {
        return comment;
    }
}