import { AppBar, Box, Button, Stack, styled, Toolbar, alpha, InputBase, Typography, IconButton } from "@mui/material";
import StyledButton from "./StyledButton.tsx";
import SearchIcon from "@mui/icons-material/Search";
import { LoginButton, LogoutButton } from "../../features/user/user-components.tsx";

// hooks
import { useIsLoginOpen } from "../contexts/IsLoginOpenContext.tsx";
import { useIsCreateOpen } from "../contexts/IsCreateOpenContext.tsx";
import { useDispatch, useSelector } from "react-redux";

// types
import { logout, selectUserIsLoggedIn } from "../../features/user/user-slice.ts";
import { clearSessionInCookies } from "../../features/user/user-utils.ts";

/**
 * Can use MUI's style() utility, 
 * instead of nesting a <Stack> within <Toolbar> that contains Logo, Login and Search.
 * This allows us to define additional properties/override existing properties of <Stack>.
 */
const StyledToolbar = styled(Toolbar)({
    display:"flex",
    justifyContent:"space-between"
})

const Search = styled("div")(({ theme }) => ({
    backgroundColor: alpha(theme.palette.common.black, 0.1),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.2),
    },
    borderRadius: theme.shape.borderRadius,
    marginLeft: "5px",
    padding: "2px 10px",
    flexGrow: "1", // so Search fills the right gap within the <Stack> (See below)
}));

export default function Navbar(): JSX.Element {

    // use hooks
    const isLoggedIn = useSelector(selectUserIsLoggedIn);

    // Constant variables
    const TITLE = "WEB FORUM";

    return (
        <Box sx={{ flexGrow: 1 }} color="primary">
            {/* static so that the components below Navbar will show */}
            <AppBar position="static">
                <StyledToolbar>
                    <Typography variant="h6">{TITLE}</Typography>
                    {/* Made width 50% of StyledToolbar so the Login + Search + Light/Dark mode 
                    makes up 50% of the navbar horizontally */}
                    <Stack direction="row" alignItems="center" width="50%">

                        {/* Light/Dark mode toggle */}
                        <IconButton>
                            Light/Dark Mode
                        </IconButton>

                        {/* Login/Logout button */}
                        {isLoggedIn ? <LogoutButton /> : <LoginButton />}

                        {/* Search bar */}
                        <Search>
                            <InputBase placeholder="Search..." />
                        </Search>
                    </Stack>
               </StyledToolbar> 
            </AppBar>
        </Box>
    )
}