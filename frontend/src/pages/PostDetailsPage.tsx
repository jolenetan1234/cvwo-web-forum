import { ConfirmPostDelete, EditPostForm, PostDetails } from "../features/post/post-components";

// hooks
import { useIsLoginOpen } from "../common/contexts/IsLoginOpenContext";
import { LoginForm } from "../features/user/user-components";
import { Box } from "@mui/material";
import { useIsEditPostOpen } from "../common/contexts/IsEditPostOpenContext";
import { useIsDeletePostOpen } from "../common/contexts/IsDeletePostOpen";
import { ConfirmDelete } from "../common/components/DeleteItem";
import { usePostDelete } from "../features/post/post-hooks";

export default function PostDetailsPage(): JSX.Element {
    // ALL HOOKS SHOULD BE CALLED AT THE VERY START, AND NOT CONDITIONALLY.
    // Else, the hooks called may differ from render to render.
    const { isLoginOpen, toggleLoginOpen } = useIsLoginOpen();
    const { isEditPostOpen } = useIsEditPostOpen();
    const { isDeletePostOpen, toggleDeletePostOpen, postId } = useIsDeletePostOpen();
    const { loading: deletePostLoading, error: deletePostError, handleDelete: handlePostDelete } = usePostDelete(
        postId, 
        () => toggleDeletePostOpen()
    );

    

    // props for `ConfirmDelete`
    let isDeleteOpen = false;
    let confirmDeleteText = '';
    let handleClose = () => {};
    let handleDelete = () => {};
    let loading = false;
    let error: string | null = '';

    if (isDeletePostOpen) {
        handleClose = () => {
            toggleDeletePostOpen();
        }

        // IMPT:
        // CANNOT call the hook here like this.
        // Because in a single render, when state of `isDeletePostOpen` changes,
        // Then this hook will not be called whereas it was called previously.
        // So React complains and says "React has detected a change in the order of Hooks".
        // const { loading: deletePostLoading, error: deletePostError, handleDelete: handlePostDelete } = usePostDelete(postId, handleClose);

        isDeleteOpen = isDeletePostOpen;
        confirmDeleteText = 'Are you sure you want to delete this post?';
        handleDelete = handlePostDelete;
        loading = deletePostLoading;
        error = deletePostError;
    }

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