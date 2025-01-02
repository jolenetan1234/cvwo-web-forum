import { ConfirmPostDelete, EditPostForm, PostDetails } from "../features/post/post-components";

// hooks
import { useIsLoginOpen } from "../common/contexts/IsLoginOpenContext";
import { LoginForm } from "../features/user/user-components";
import { Box } from "@mui/material";
import { useIsEditPostOpen } from "../common/contexts/IsEditPostOpenContext";
import { useIsDeletePostOpen } from "../common/contexts/IsDeletePostOpen";
import { ConfirmDelete } from "../common/components/DeleteItem";
import { usePostDelete } from "../features/post/post-hooks";
import { useIsDeleteCommentOpen } from "../common/contexts/IsDeleteCommentOpen";
import { useCommentDelete } from "../features/comment/comment-hooks";
import { useParams } from "react-router-dom";
import CommentSection from "../features/comment/comment-components";

export default function PostDetailsPage(): JSX.Element {
    // ALL HOOKS SHOULD BE CALLED AT THE VERY START, AND NOT CONDITIONALLY.
    // Else, the hooks called may differ from render to render.
    // postId
    const params = useParams<{ id : string }>();
    const postId = params.id ?? '';

    // States for login form and edit post form
    const { isLoginOpen, toggleLoginOpen } = useIsLoginOpen();
    const { isEditPostOpen } = useIsEditPostOpen();

    // States and variables for delete post
    const { isDeletePostOpen, toggleDeletePostOpen } = useIsDeletePostOpen();
    const { loading: deletePostLoading, error: deletePostError, handleDelete: handlePostDelete } = usePostDelete(
        postId, 
        () => toggleDeletePostOpen()
    );

    // States and variables for delete comment
    const { isDeleteCommentOpen, toggleDeleteCommentOpen, commentId } = useIsDeleteCommentOpen();
    const { 
        loading: deleteCommentLoading, 
        error: deleteCommentError, 
        handleDelete: handleCommentDelete 
    } = useCommentDelete(
        commentId,
        () => toggleDeleteCommentOpen()
    );

    // props for `ConfirmDelete`
    let title = '';
    let isDeleteOpen = false;
    let confirmDeleteText = '';
    let handleClose = () => {};
    let handleDelete = () => {};
    let loading = false;
    let error: string | null = '';

    switch (true) {
        case isDeletePostOpen:
            title = 'Delete Post';
            isDeleteOpen = isDeletePostOpen;
            confirmDeleteText = 'Are you sure you want to delete this post?';
            handleClose = () => {
                toggleDeletePostOpen();
            };
            handleDelete = handlePostDelete;
            loading = deletePostLoading;
            error = deletePostError;
            break;

        case isDeleteCommentOpen:
            title = 'Delete Comment';
            isDeleteOpen = isDeleteCommentOpen;
            confirmDeleteText = 'Are you sure you want to delete this comment?';
            handleClose = () => {
                toggleDeleteCommentOpen();
            };
            handleDelete = handleCommentDelete;
            loading = deleteCommentLoading;
            error = deleteCommentError;
    }


    return (
        <Box>
            <PostDetails postId={postId} />
            <CommentSection postId={postId} />
            { isLoginOpen ? <LoginForm /> : <></>}
            { isEditPostOpen ? <EditPostForm /> : <></>}
            {/* { isDeletePostOpen ? <ConfirmPostDelete /> : <></>} */}
            <ConfirmDelete 
            title={title}
            isOpen={isDeleteOpen} 
            confirmDeleteText={confirmDeleteText} 
            handleClose={handleClose} 
            handleDelete={handleDelete} 
            loading={loading} 
            error={error} 
            />
        </Box>
    )
}