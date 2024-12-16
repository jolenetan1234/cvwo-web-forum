import { Box } from "@mui/material";
import Feed from "../features/feed/feed-components";

export default function HomePage(): JSX.Element {
    return (
        <Box>
            {/* Stack is basically a flexbox */}
            <Feed/>
        </Box>
   )
}