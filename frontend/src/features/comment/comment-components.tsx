// components
import { Box, Card, CardContent, CardHeader, Dialog, Divider, FormControl, InputLabel, Paper, Stack, styled, TextField, Typography } from "@mui/material";
import { AddComment, Edit, Delete } from "@mui/icons-material";
import ErrorMessage from "../../common/components/ErrorMessage";
import Loading from "../../common/components/Loading.tsx";
import StyledButton from "../../common/components/StyledButton.tsx";

// types
import Comment, { NewComment, UpdatedComment } from "../comment/comment-types.ts";

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
import { useCreateCommentForm, useEditCommentForm, useGetCommentsByPostId } from "./comment-hooks.ts";
import { DeleteItemButton } from "../../common/components/DeleteItem.tsx";
import { isAuthor } from "../post/post-utils.ts";
import { useIsDeleteCommentOpen } from "../../common/contexts/IsDeleteCommentOpen.tsx";
import CreateItemButton from "../../common/components/CreateItem.tsx";
import { useIsCreateCommentOpen } from "../../common/contexts/IsCreateCommentOpenContext.tsx";
import { FormField } from "../../common/types/common-types.ts";
import { StyledHeader, SubmitButton } from "../../common/components/Form.tsx";
import { selectUserIsLoggedIn, selectUserToken } from "../user/user-slice.ts";
import { useIsLoginOpen } from "../../common/contexts/IsLoginOpenContext.tsx";
import { useIsEditCommentOpen } from "../../common/contexts/IsEditCommentOpenContext.tsx";

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

// FEATURE: VIEW COMMENTS
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


    return (
        <Stack direction='row' justifyContent='space-between'>
            {/* Left side with username and content */}
            <Stack>
                {/* Username */}
                <Typography 
                variant='subtitle2'
                sx={{ fontWeight: 'bold', }}
                >
                    {user?.username ?? 'Unknown Author'}
                </Typography>

                {/* Content */}
                <Typography>{comment.content}</Typography>
            </Stack>

            {/* Right side with date, delete button, edit button */}
            <Stack alignItems='center'>
                {/* Date */}
                <Typography 
                variant='subtitle2'
                sx={{ fontWeight: 'bold', }}
                >
                    {/* TODO: replace with `created_at` */}
                    00000
                </Typography>

                {/* Delete Button, Edit Button */}
                {isAuthor(comment) ? 
                    <Stack direction='row' alignItems='center'>
                        <DeleteCommentButton commentId={comment.id}/>
                        <EditCommentButton comment={comment}/>
                    </Stack>
                :
                <></>
                }

            </Stack>

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

const CommentSectionHeader = (): JSX.Element => {

    return (
        <CardHeader
        title={
            <Stack 
            direction='row' 
            sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Title containing "Comments" title and CreateCommentButton */}
                <Typography 
                variant="h5" 
                sx={{ mt: -1, fontWeight: 'bold', }}
                >
                    Comments
                </Typography>

                <CreateCommentButton />
            </Stack>
        }
        />
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
        <Card sx={{ mt: 1, ml: 2, mr: 2 }}>
            {/* Comment Section Header */}
            <CommentSectionHeader />

            {/* List of comments */}
            <CardContent>
                <Stack>
                    <Divider sx={{ my: 1, mt: -3 }}/>
                    {/* Comments list */}
                    <Comments comments={comments as Comment[]} />
                </Stack>
            </CardContent>
        </Card>
    )
}

// FEATURE: CREATE COMMENT
const CreateCommentButton = (): JSX.Element => {

    const { toggleCreateCommentOpen } = useIsCreateCommentOpen();
    const { toggleLoginOpen } = useIsLoginOpen();
    const isLoggedIn = useAppSelector(selectUserIsLoggedIn);

    /**
     * Toggle the CreateCommentForm open.
     */
    const handleClick = () => {
        if (isLoggedIn) {
            toggleCreateCommentOpen();
        } else {
            toggleLoginOpen();
        }
    };

    return (
        <StyledButton
        content={<AddComment />}
        onClick={handleClick}
        sx={{ 
            color: 'primary.main',
            px: 0,
        }}
        />
    );
}

const CreateCommentForm = ({ postId }: { 
    postId: string 
}): JSX.Element => {

    const fields: FormField[] = [
        {
            fieldType: 'input',
            placeholder: 'Comment',
            name: 'content',
            required: true,
        }
    ]

    const handleClose = () => {
        toggleCreateCommentOpen();
    };

    // HOOKS
    const { isCreateCommentOpen, toggleCreateCommentOpen } = useIsCreateCommentOpen();
    const { data, loading, error, handleChange, handleSubmit } = useCreateCommentForm(postId, handleClose);

    return (
        // dialog box
        <Dialog open={isCreateCommentOpen} maxWidth="xs" onClose={handleClose}>

                <Paper elevation={8} sx={{p: 2}}>
                    <StyledHeader
                    avatar="Hi"
                    title="Add Comment"
                    handleClose={handleClose}
                    />
                    
                    {/* form component  */}
                    <Box
                    component="form"
                    onSubmit={handleSubmit}>
                        {fields.map(field => (
                            <TextField
                            key={field.name}
                            fullWidth
                            placeholder={field.required ? `${field.placeholder}*` : field.placeholder}
                            required={field.required}
                            sx={{ mb: 2 }}
                            autoFocus
                            {...(field.type ? { type: field.type } : {})} // Conditionally add the type attribute
                            name={field.name}
                            value={data[field.name as keyof NewComment]} // Eg. value = data[content]
                            onChange={handleChange}
                            />
                        ))}

                        {/* Submit button */}
                        <SubmitButton
                        submitButtonText={<>Add Comment</>}
                        loading={loading}
                        sx={{ mt: 1 }}
                        />

                        {/* Error message */}
                        {error ? <Typography textAlign='center' sx={{ mt: 1 }}>{error}</Typography> : <></>}
                    </Box>

                </Paper>

        </Dialog>
    );
}

// FEATURE: EDIT COMMENT
const EditCommentButton = ({ comment }: {
    comment: Comment,
}): JSX.Element => {

    const { toggleEditCommentOpen } = useIsEditCommentOpen();

    /**
     * Toggles open the EditCommentForm component.
     */
    const handleClick = () => {
        toggleEditCommentOpen(comment);
    };

    return (
        <Edit
        onClick={handleClick}
        sx={{ 
            color: 'gray',
            cursor: 'pointer',
        }}
        />
    )
}

const EditCommentForm = (): JSX.Element => {

    const { isEditCommentOpen, toggleEditCommentOpen } = useIsEditCommentOpen();

    const handleClose = () => {
        toggleEditCommentOpen();
    }

    const { data, loading, error, handleChange, handleSubmit } = useEditCommentForm(handleClose);

    const fields: FormField[] = [
        {
            fieldType: 'input',
            placeholder: 'Comment',
            name: 'content',
            required: true,
        }
    ]
    
    return (
        // dialog box
        <Dialog open={isEditCommentOpen} maxWidth="xs" onClose={handleClose}>

                <Paper elevation={8} sx={{p: 2}}>
                    <StyledHeader
                    avatar={<Edit />}
                    title="Edit Comment"
                    handleClose={handleClose}
                    />
                    
                    {/* form component  */}
                    <Box
                    component="form"
                    onSubmit={handleSubmit}>
                        {fields.map(field => (
                            <TextField
                            key={field.name}
                            fullWidth
                            placeholder={field.required ? `${field.placeholder}*` : field.placeholder}
                            required={field.required}
                            sx={{ mb: 2 }}
                            autoFocus
                            {...(field.type ? { type: field.type } : {})} // Conditionally add the type attribute
                            name={field.name}
                            value={data[field.name as keyof UpdatedComment]} // Eg. value = data[content]
                            onChange={handleChange}
                            />
                        ))}

                        {/* Submit button */}
                        <SubmitButton
                        submitButtonText={<>Save</>}
                        loading={loading}
                        sx={{ mt: 1 }}
                        />

                        {/* Error message */}
                        {error ? <Typography textAlign='center' sx={{ mt: 1 }}>{error}</Typography> : <></>}
                    </Box>

                </Paper>

        </Dialog>
    )
}

// FEATURE: DELETE COMMENT
const DeleteCommentButton = ({ commentId }: {
    commentId: string,
}): JSX.Element => {
    /**
     * Handles the event where the `Delete` button is clicked.
     */
    const { toggleDeleteCommentOpen } = useIsDeleteCommentOpen();
    const handleDeleteOpen = () => {
        toggleDeleteCommentOpen(commentId);
    };

    return (
        <Delete
        onClick={handleDeleteOpen}
        sx={{
            color: 'red',
            cursor: 'pointer',
        }}
        />
    )
}

export { CreateCommentForm, EditCommentForm };
export default CommentSection;