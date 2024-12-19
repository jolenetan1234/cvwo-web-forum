import { Outlet } from "react-router-dom";
import Navbar from "../common/components/Navbar"
import { Box } from "@mui/material";

export default function MainLayout(): JSX.Element {
    return (
        <Box>
            <Navbar />
            <Outlet />
        </Box>
    )
}