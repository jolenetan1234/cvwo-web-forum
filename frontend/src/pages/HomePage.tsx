import { Box } from "@mui/material";
import Feed from "../features/feed/feed-components";
import Post from "../types/Post";

export default function HomePage({ getAllPosts }: { getAllPosts: () => Post[] }): JSX.Element {
    return (
        <Box>
            {/* Stack is basically a flexbox */}
            <Feed posts={getAllPosts()}/>
        </Box>
   )
}