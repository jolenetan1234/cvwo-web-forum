import { PostDetails } from "../features/post/post-components";

// hooks
import { useIsOpen } from "../common/contexts/IsOpenContext";
import { LoginForm } from "../features/user/user-components";
import { Box } from "@mui/material";

export default function PostDetailsPage(): JSX.Element {
    const { isOpen, toggleOpen } = useIsOpen();

    return (
        <Box>
            <PostDetails />
            { isOpen ? <LoginForm /> : <></>}
        </Box>
    )
}