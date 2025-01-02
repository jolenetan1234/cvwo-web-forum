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
import { DeleteItemButton } from "../../common/components/DeleteItem.tsx";
import { isAuthor } from "../post/post-utils.ts";
import { useIsDeleteCommentOpen } from "../../common/contexts/IsDeleteCommentOpen.tsx";

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
const CommentCard = ({ comment }: { comment: Comment, }): JSX.Element => {
    const fetchUser = useCallback(
        () => userClient.getById(comment.user_id),
        [comment]
    )

    const { data: user, error, loading } = useFetch(fetchUser);

    /**
     * Handles the event where the `Delete` button is clicked.
     */
    const { toggleDeleteCommentOpen } = useIsDeleteCommentOpen();
    const handleDeleteOpen = () => {
        toggleDeleteCommentOpen(comment.id);
    }

    return (
        <Stack>
            {/* Header with username, data, delete button */}
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
                <Typography 
                variant='subtitle2'
                sx={{ fontWeight: 'bold', }}
                >
                    {user?.username ?? 'Unknown Author'}
                </Typography>

                {/* Date and Delete Button */}
                <Stack direction='row' alignItems='center'>
                    {isAuthor(comment) ?
                        <DeleteItemButton 
                        itemId={comment.user_id}
                        handleDeleteOpen={handleDeleteOpen}
                        sx={{ py: 0 }}
                        />
                        :
                        <Box />
                    }
                    <Typography 
                    variant='subtitle2'
                    sx={{ fontWeight: 'bold', }}
                    >
                        {/* TODO: replace with `created_at` */}
                        00000
                    </Typography>
                </Stack>
            </Stack>

            {/* Content */}
            <Typography>{comment.content}</Typography>

        </Stack>
    )
}

/**
 * List view of the comments under a Post.
 * @param {Object} props - Properties passed to the `Comments` component.
 * @param {Comment[]} comments - List of Comments under a Post.
 * @returns {JSX.Element} A component displaying the Commment list.
 */
const Comments = ({ comments }: { comments: Comment[] }): JSX.Element => {
    return (
        <Box>
            <Stack divider={<Divider sx={{ my: 1 }}/>}>
                {comments.map(comment => (
                    <CommentCard key={comment.id} comment={comment}/>
                ))}
            </Stack>

            {/* Last divider */}
            <Divider sx={{ mt: 1 }}/>
        </Box>
    )
}

/**
 * The entire Comment Section component.
 * @param {Object} props - Properties passed to the `CommentSection` component.
 * @param {string} postId - The unique identifier for the Post the Commments are under.
 * @returns {JSX.Element} A component displaying the Comment Section.
 */
const CommentSection = ({ postId }: { postId: string }): JSX.Element => {

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
            <Typography variant="h6" sx={{ mt: -1 }}>Comments</Typography>
            <Divider sx={{ my: 1 }}/>

            {/* "POST comment" bar */}
            
            {/* Comments list */}
            <Comments comments={comments as Comment[]} />
        </Stack>
    )
}

export default CommentSection;