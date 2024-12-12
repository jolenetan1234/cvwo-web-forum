import { Box, Stack } from "@mui/material";
import Feed from "../features/feed/feed-components";
import RightBar from "../components/RightBar";
import { Cards, CategoryHeader } from "../features/feed/feed-components";

// HARD CODED
const posts = [
    {
        id: 1,
        title: "My first Lego Block",
        content: "I love Lego",
    },
    {
        id: 2,
        title: "I stubbed my toe",
        content: "I banged it against the table :("
    }
]

export default function HomePage(): JSX.Element {
    return (
        <Box>
            {/* Stack is basically a flexbox */}
            <Feed posts={posts}/>
        </Box>
   )
}