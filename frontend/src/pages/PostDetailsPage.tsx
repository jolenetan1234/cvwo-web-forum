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

export default function PostDetailsPage(): JSX.Element {
    // ALL HOOKS SHOULD BE CALLED AT THE VERY START, AND NOT CONDITIONALLY.
    // Else, the hooks called may differ from render to render.
    const { isLoginOpen, toggleLoginOpen } = useIsLoginOpen();
    const { isEditPostOpen } = useIsEditPostOpen();

    // States and variables for delete post
    const { isDeletePostOpen, toggleDeletePostOpen, postId } = useIsDeletePostOpen();
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
    let isDeleteOpen = false;
    let confirmDeleteText = '';
    let handleClose = () => {};
    let handleDelete = () => {};
    let loading = false;
    let error: string | null = '';

    switch (true) {
        case isDeletePostOpen:
            handleClose = () => {
                toggleDeletePostOpen();
            };
            isDeleteOpen = isDeletePostOpen;
            confirmDeleteText = 'Are you sure you want to delete this post?';
            handleDelete = handlePostDelete;
            loading = deletePostLoading;
            error = deletePostError;
            break;

        case isDeleteCommentOpen:
            handleClose = () => {
                toggleDeleteCommentOpen();
            };
            isDeleteOpen = isDeleteCommentOpen;
            confirmDeleteText = 'Are you sure you want to delete this comment?';
            handleDelete = handleCommentDelete;
            loading = deleteCommentLoading;
            error = deleteCommentError;
    }

    // if (isDeletePostOpen) {
    //     handleClose = () => {
    //         toggleDeletePostOpen();
    //     }
    //     isDeleteOpen = isDeletePostOpen;
    //     confirmDeleteText = 'Are you sure you want to delete this post?';
    //     handleDelete = handlePostDelete;
    //     loading = deletePostLoading;
    //     error = deletePostError;
    // } else if (isDeleteCommentOpen) {
    //     handleClose = () => {
    //         toggleDeleteCommentOpen();
    //     }
    //     isDeleteOpen = 
    // }

    return (
        <Box>
            <PostDetails />
            { isLoginOpen ? <LoginForm /> : <></>}
            { isEditPostOpen ? <EditPostForm /> : <></>}
            {/* { isDeletePostOpen ? <ConfirmPostDelete /> : <></>} */}
            <ConfirmDelete 
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