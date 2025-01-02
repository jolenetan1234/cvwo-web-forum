import { Box } from "@mui/material";
import { useIsLoginOpen } from "../common/contexts/IsLoginOpenContext";
import { LoginForm, SignupForm } from "../features/user/user-components";

export default function SignUpPage(): JSX.Element {
    const { isLoginOpen, toggleLoginOpen } = useIsLoginOpen();
    return (
        <Box>
            <SignupForm />
            { isLoginOpen ? <LoginForm /> : <></>}
        </Box>
    )
}