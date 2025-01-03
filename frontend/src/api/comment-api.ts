// NOTE: this is only for development purposes.
// USELESS once backend is set up.

interface BackendComment {
    id: number;
    content: string;
    post_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
}

/**
 * The shape of the object data needed to POST a new comment
 * by the backend.
 */
interface BackendCreateCommentData {
    content: string;
    post_id: number;
}

interface BackendUpdateCommentData {
    content: string;
}

// HARDCODED
const COMMENTS: BackendComment[] = [
    {
        id: 1,
        content: "Who even likes lego nowadays",
        post_id: 1,
        user_id: 2,
        created_at: Date(),
        updated_at: Date(),
    },
    {
        id: 2,
        content: "haha loser",
        post_id: 2,
        user_id: 2,
        created_at: Date(),
        updated_at: Date(),
    },
    {
        id: 3,
        content: "hope u step on legos",
        post_id: 1,
        user_id: 3,
        created_at: Date(),
        updated_at: Date(),
    },
    {
        id: 4,
        content: "haha",
        post_id: 1,
        user_id: 4,
        created_at: Date(),
        updated_at: Date(),
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
    // NOTE: actual backend also needs to check if the post exists.
    // If not, throw an error. (Instead of just returning an empty array)
    const comments = COMMENTS.filter(c => c.post_id === postId);

    return comments; 
}

/**
 * Filters and returns a Comment, based on the `commentID`.
 * @param {number} commentId - ID of the Comment.
 * @returns {Comment} The Comment with ID == `commentID`.
 */
export const getCommentById = async (commentId: number): Promise<BackendComment> => {
    const comment = COMMENTS.find(c => c.id === commentId);

    // if not found, throw error
    if (!comment) {
        throw {
            status: '404',
            message: 'Comment not found',
        };
    } else {
        return comment;
    }
}

export const deleteComment = async (commentId: number): Promise<BackendComment> => {
    const comment = COMMENTS.find(c => c.id === commentId);

    // if not found, throw error
    if (!comment) {
        throw {
            status: '404',
            message: 'Comment not found',
        };
    } else {
        return comment;
    }
}

// MOCK API endpoint for POST API_BASE_URL/comments
export const createComment = async (data: BackendCreateCommentData): Promise<BackendComment> => {
    // TODO: need authorise with token.
    const newComment = {
        id: COMMENTS.length + 1,
        content: data.content,
        post_id: data.post_id,
        user_id: 2, // HARD-CODED. IN ACTUAL IMPLEMENTATION WILL CHECK FROM TOKEN
        created_at: Date(),
        updated_at: Date(),
    }

    return newComment;
}

// MOCK API endpoint for PUT API_BASE_URL/comments/:commentId
export const updateComment = async (data: BackendUpdateCommentData, commentId: number): Promise<BackendComment> => {
    // TODO: need authorise with token and chheck if the user can indeed update this post
    const comment = COMMENTS.find(c => c.id === commentId);
    // TODO: check comment.user_id is same as user_id in token

    if (!comment) {
        // mock an error
        throw {
            status: 404,
            message: 'Failed to UPDATE comment: Comment does not exist',
        };
    } else {
        const updatedComment = {
            ...comment,
            content: data.content,
            updated_at: Date(),
        };

        return updatedComment;
    }
}