import { EditPostForm, PostDetails } from "../features/post/post-components";

// hooks
import { useIsLoginOpen } from "../common/contexts/IsLoginOpenContext";
import { LoginForm } from "../features/user/user-components";
import { Box } from "@mui/material";
import { useIsEditPostOpen } from "../common/contexts/IsEditPostOpenContext";
import { useIsDeletePostOpen } from "../common/contexts/IsDeletePostOpen";
import { ConfirmDelete } from "../common/components/DeleteItem";
import { useAllPosts, usePostDelete } from "../features/post/post-hooks";
import { useIsDeleteCommentOpen } from "../common/contexts/IsDeleteCommentOpen";
import { useCommentDelete } from "../features/comment/comment-hooks";
import { useParams } from "react-router-dom";
import CommentSection, { CreateCommentForm, EditCommentForm } from "../features/comment/comment-components";
import { useEffect, useState } from "react";
import Loading from "../common/components/Loading";
import ErrorMessage from "../common/components/ErrorMessage";
import Post from "../features/post/post-types";
import { useIsCreateCommentOpen } from "../common/contexts/IsCreateCommentOpenContext";
import { useIsEditCommentOpen } from "../common/contexts/IsEditCommentOpenContext";

export default function PostDetailsPage(): JSX.Element {
    // ALL HOOKS SHOULD BE CALLED AT THE VERY START, AND NOT CONDITIONALLY.
    // Else, the hooks called may differ from render to render.
    // postId
    const params = useParams<{ id : string }>();
    const postId = params.id ?? '';

    // States and variables for LoginForm, EditPostForm, CreateCommentForm, EditCommentForm
    const { isLoginOpen } = useIsLoginOpen();
    const { isEditPostOpen } = useIsEditPostOpen();
    const { isCreateCommentOpen } = useIsCreateCommentOpen();
    const { isEditCommentOpen } = useIsEditCommentOpen();

    // States and variables for DeletePost
    const { isDeletePostOpen, toggleDeletePostOpen } = useIsDeletePostOpen();
    const { loading: deletePostLoading, error: deletePostError, handleDelete: handlePostDelete } = usePostDelete(
        postId, 
        () => toggleDeletePostOpen()
    );

    // States and variables for DeleteComment
    const { isDeleteCommentOpen, toggleDeleteCommentOpen, commentId } = useIsDeleteCommentOpen();
    const { 
        loading: deleteCommentLoading, 
        error: deleteCommentError, 
        handleDelete: handleCommentDelete 
    } = useCommentDelete(
        commentId ?? '',
        () => toggleDeleteCommentOpen()
    );

    // props for `ConfirmDelete`
    let title = '';
    let isDeleteOpen = false;
    let confirmDeleteText = '';
    let handleClose = () => {};
    let handleDelete = () => {};
    let deleteLoading = false;
    let deleteError: string | null = '';

    switch (true) {
        case isDeletePostOpen:
            title = 'Delete Post';
            isDeleteOpen = isDeletePostOpen;
            confirmDeleteText = 'Are you sure you want to delete this post?';
            handleClose = () => {
                toggleDeletePostOpen();
            };
            handleDelete = handlePostDelete;
            deleteLoading = deletePostLoading;
            deleteError = deletePostError;
            break;

        case isDeleteCommentOpen:
            title = 'Delete Comment';
            isDeleteOpen = isDeleteCommentOpen;
            confirmDeleteText = 'Are you sure you want to delete this comment?';
            handleClose = () => {
                toggleDeleteCommentOpen();
            };
            handleDelete = handleCommentDelete;
            deleteLoading = deleteCommentLoading;
            deleteError = deleteCommentError;
    }

    // Fetching all posts and finding the post
    const [post, setPost] = useState<Post | undefined>(undefined);
    const { allPosts, loading: getAllPostsLoading, error: getAllPostsError } = useAllPosts();
    useEffect(() => {
        setPost(allPosts.find(p => p.id === postId));
    }, [allPosts, isEditPostOpen]);

    if (getAllPostsLoading) {
        return <Loading />
    } else if (getAllPostsError) {
        return (
            <ErrorMessage message={getAllPostsError} />
        );
    } else if (!post) {
        return (
            <ErrorMessage message='Post not found' />
        )
    }

    return (
        <Box>
            <PostDetails post={post} />
            <CommentSection postId={postId} />
            { isLoginOpen ? <LoginForm /> : <></>}
            { isEditPostOpen ? <EditPostForm post={post}/> : <></>}
            { isCreateCommentOpen ? <CreateCommentForm postId={postId} /> : <></>}
            { isEditCommentOpen ? <EditCommentForm /> : <></>}
            <ConfirmDelete 
            title={title}
            isOpen={isDeleteOpen} 
            confirmDeleteText={confirmDeleteText} 
            handleClose={handleClose} 
            handleDelete={handleDelete} 
            loading={deleteLoading} 
            error={deleteError} 
            />
        </Box>
    )
}