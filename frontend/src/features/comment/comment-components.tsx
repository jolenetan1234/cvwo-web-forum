import { Box, Divider, Stack, styled, Typography } from "@mui/material";
import ErrorMessage from "../../common/components/ErrorMessage";

// types
import Comment from "../../types/Comment";
import NotFoundError from "../../common/errors/NotFoundError";

// API calls
import { getCommentsByPostId } from "../../api/comment-api";
import { getUserById } from "../../api/user-api";

// styled
const StyledCommentBox = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
})

function PostCommentBar(): JSX.Element {
    return (
        <>new comment..</>
    )
}

/**
 * Card view of a Comment.
 * @param {Object} props - Properties passed to the CommentCard component.
 * @param {number} props.commentId - Comment ID.
 * @param {(commentId: number) => Comment} props.getCommentById - Function that handles API call to get the comment.
 * @param {({ message }: { message: string }) => JSX.Element} props.ErrorComponent - Component that displays error message
 * @returns {JSX.Element} A component displaying the Comment.
 */
function CommentCard({ comment }: { comment: Comment, }): JSX.Element {
    let user;

    try {
        user = getUserById(comment.userId);
    } catch (err) {
        if (err instanceof NotFoundError) {
            return <ErrorMessage message={err.toString()}/>
        } else {
            return <ErrorMessage message="An unknown error occured." />
        }
    }

    return (
        <StyledCommentBox>
            {/* Username and content */}
            <Box>
            <Typography variant="subtitle2">
                {user.username}
            </Typography>
            <Typography variant="body1">
                {comment.content}
            </Typography>
            </Box>

            {/* createdat */}
            <Typography fontSize="small">00000</Typography>
        </StyledCommentBox>
    )
}

function Comments({ comments }: { comments: Comment[] }): JSX.Element {
    return (
        <Stack divider={<Divider />}>
            {comments.map(comment => (
                <CommentCard key={comment.id} comment={comment}/>
            ))}
            {/* Last divider */}
            <Divider />
        </Stack>
    )
}

export default function CommentSection({ postId }: { postId: number }): JSX.Element {
    // Fetch comments
    const comments = getCommentsByPostId(postId);

    // "POST comment" bar
    // comments list
    return (
        <Stack>
            <Typography variant="h6">Comments</Typography>
            <Divider />

            {/* "POST comment" bar */}
            
            {/* Comments list */}
            <Comments comments={comments}/>
        </Stack>
    )
}