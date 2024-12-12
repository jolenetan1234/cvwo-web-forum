import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"
import { Box } from "@mui/material";

export default function MainLayout(): JSX.Element {
    return (
        <Box>
            <Navbar title="WEB FORUM" buttonText="Login"/>
            <Outlet />
        </Box>
    )
}