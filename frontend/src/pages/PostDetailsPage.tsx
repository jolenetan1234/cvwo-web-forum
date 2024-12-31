import { EditPostForm, PostDetails } from "../features/post/post-components";

// hooks
import { useIsLoginOpen } from "../common/contexts/IsLoginOpenContext";
import { LoginForm } from "../features/user/user-components";
import { Box } from "@mui/material";
import { useIsEditPostOpen } from "../common/contexts/IsEditPostOpenContext";

export default function PostDetailsPage(): JSX.Element {
    const { isLoginOpen, toggleLoginOpen } = useIsLoginOpen();
    const { isEditPostOpen } = useIsEditPostOpen();

    return (
        <Box>
            <PostDetails />
            { isLoginOpen ? <LoginForm /> : <></>}
            { isEditPostOpen ? <EditPostForm /> : <></>}
        </Box>
    )
}