import { Box, Divider, Stack, styled, Typography } from "@mui/material";
import ErrorMessage from "../../common/components/ErrorMessage";
import Loading from "../../common/components/Loading.tsx";

// types
import Comment from "../comment/comment-types.ts";

// hooks
import useFetch from "../../common/hooks/useFetch";

// API clients
import commentClient from "./comment-api-client.ts";
import userClient from "../user/user-api-client.ts";
import { useCallback } from "react";

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
    const fetchUser = useCallback(
        () => userClient.getById(comment.user_id),
        [comment]
    )

    const { data, error, loading } = useFetch(fetchUser);
    /*
    const { data, error, loading } = useFetch(
        () => userClient.getById(comment.userId)
    );
    */

    const user = data;

    /*
    let user;

    try {
        // user = getUserById(comment.userId);
        user = {
        id: 2,
        username: "meowmeowmeowmeow",
        password: "pw",
        }
    } catch (err) {
        if (err instanceof NotFoundError) {
            return <ErrorMessage message={err.toString()}/>
        } else {
            return <ErrorMessage message="An unknown error occured." />
        }
    }
    */

    return (
        <StyledCommentBox>
            {/* Username and content */}
            <Box>
            <Typography variant="subtitle2">
                {user?.username}
            </Typography>
            <Typography variant="body1">
                {comment.content}
            </Typography>
            </Box>

            {/* created_at */}
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
    // memoize the callback
    const fetchComments = useCallback(
        () => commentClient.getByPostId(postId),
        [postId]
    );

    // Fetch comments
    // const comments = await getCommentsByPostId(postId);
    /*
    const { data, error, loading } = useFetch<Comment[]>(
        () => commentClient.getByPostId(postId)
    )
        */

    const { data, error, loading } = useFetch(fetchComments);

    const comments = data;

    if (loading) {
        return <Loading />
    } else if (error != "") {
        return <ErrorMessage message={error} />
    }

    // "POST comment" bar
    // comments list
    return (
        <Stack>
            <Typography variant="h6">Comments</Typography>
            <Divider />

            {/* "POST comment" bar */}
            
            {/* Comments list */}
            <Comments comments={comments as Comment[]} />
        </Stack>
    )
}