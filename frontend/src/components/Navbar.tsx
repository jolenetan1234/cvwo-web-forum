import { AppBar, Box, Button, Stack, styled, Toolbar, alpha, InputBase, Typography, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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

interface NavbarProps {
    title: string;
    buttonText: string;
}

export default function Navbar({ title, buttonText }: NavbarProps): JSX.Element {
    return (
        <Box sx={{ flexGrow: 1 }} color="primary">
            <AppBar position="static">
                <StyledToolbar>
                    <Typography variant="h6">{title}</Typography>
                    {/* Made width 50% so the Login + Search + Light/Dark mode 
                    makes up 50% of the navbar horizontally */}
                    <Stack direction="row" alignItems="center" width="50%">
                        {/* Light/Dark mode toggle */}
                        <IconButton>
                            Light/Dark Mode
                        </IconButton>

                        {/* Login/Logout button */}
                        <Button color="inherit">
                            {buttonText}
                        </Button> 

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