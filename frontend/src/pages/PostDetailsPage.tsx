import { PostDetails } from "../features/post/post-components";

// hooks
import { useIsLoginOpen } from "../common/contexts/IsLoginOpenContext";
import { LoginForm } from "../features/user/user-components";
import { Box } from "@mui/material";

export default function PostDetailsPage(): JSX.Element {
    const { isLoginOpen, toggleLoginOpen } = useIsLoginOpen();

    return (
        <Box>
            <PostDetails />
            { isLoginOpen ? <LoginForm /> : <></>}
        </Box>
    )
}