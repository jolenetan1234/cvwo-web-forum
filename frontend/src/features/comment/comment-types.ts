
/**
 * @interface Comment - The shape of the Comment object in the frontend.
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
}