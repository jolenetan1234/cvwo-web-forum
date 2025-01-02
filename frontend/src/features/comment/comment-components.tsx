import { Box, Divider, Stack, styled, Typography } from "@mui/material";
import ErrorMessage from "../../common/components/ErrorMessage";
import Loading from "../../common/components/Loading.tsx";

// types
import Comment from "../comment/comment-types.ts";

// hooks
import useFetch from "../../common/hooks/useFetch";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks.ts";
import { useCallback, useEffect, useState } from "react";

// API clients
import commentClient from "./comment-api-client.ts";
import userClient from "../user/user-api-client.ts";

// thunks/actions
import { getCommentsByPostId, selectCommentsByAllPostId, selectCommentsByPostIdError, selectCommentsByPostIdStatus } from "./comment-slice.ts";

// selectors
import { selectCommentsByPostId } from "./comment-slice.ts";
import { useGetCommentsByPostId } from "./comment-hooks.ts";

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

    const user = data;

    // dispatch(fetchComments(postId));

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

export default function CommentSection({ postId }: { postId: string }): JSX.Element {

    const { data: comments, loading, error } = useGetCommentsByPostId(postId);

    if (loading) {
        return <Loading />
    } else if (error) {
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