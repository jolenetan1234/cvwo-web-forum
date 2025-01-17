
/**
 * @interface Comment - The shape of the Comment object in the frontend.
 * 
 * @property {string} id - The UUID of a Comment.
 * @property {string} content - The text content of a Comment.
 * @property {string} post_id - The UUID of the Post associated to the Comment.
 * @property {string} user_id - The UUID of the User who made the Comment.
 */
export default interface Comment {
    id: string;
    content: string;
    post_id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

/**
 * @interface NewComment - The shape of the data needed to create a new comment.
 *  
 * @property {string} content - The text content of a Comment.
 * @property {string} post_id - The ID of the post under which the comment resides.
 */
export interface NewComment {
    content: string;
    post_id: string;
}

/**
 * @interface UpdatedComment - The shape of the data needed to update a comment.
 * 
 * @property {string} content - The updated text content of a Comment.
 */
export interface UpdatedComment {
    content: string;
}