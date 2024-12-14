import { Box } from "@mui/material";
import Feed from "../features/feed/feed-components";

// API calls
import { getAllPosts } from "../api/post-api";

export default function HomePage(): JSX.Element {
    return (
        <Box>
            {/* Stack is basically a flexbox */}
            <Feed posts={getAllPosts()}/>
        </Box>
   )
}