import { AppBar, Box, Button, Stack, styled, Toolbar, alpha, InputBase, Typography, IconButton } from "@mui/material";
import StyledButton from "./StyledButton.tsx";
import SearchIcon from "@mui/icons-material/Search";

// hooks
import useToggle from "../hooks/useToggle.ts";
import { useIsOpen } from "../contexts/IsOpenContext.tsx";

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
    const loginForm = useToggle();
    const { isOpen, toggleOpen } = useIsOpen();

    // Constant variables
    const TITLE = "WEB FORUM";
    const BUTTONTEXT = "Login";
    const ONCLICK = (): void => {
        toggleOpen();
    };

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
                        <StyledButton content={BUTTONTEXT} onClick={ONCLICK} />

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