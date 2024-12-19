import { Box } from "@mui/material";
import { Feed } from "../features/post/post-components";

export default function HomePage(): JSX.Element {
    return (
        <Box>
            {/* Stack is basically a flexbox */}
            <Feed/>
        </Box>
   )
}