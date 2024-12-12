import { Box, Card, CardActionArea, CardHeader, Link, Stack } from "@mui/material";
import Post from "../../types/Post";

/**
 * A subheader containing the options for categories.
 * @returns The subheader above Cards.
 */
function CategoryHeader(): JSX.Element {
    return (
       <Box sx={{ display: "flex", }}>
        Categories
       </Box>
    )
}

/**
 * Card view of a Post.
 * When clicked, redirects to the Post details.
 * @param {Object} props - Properties passed to the PostCard component.
 * @param {number} props.key - Post ID.
 * @param {string} props.title - Post title.
 * @param {string} props.content - Post content.
 * @returns {JSX.Element} A component displaying a Post.
 */
function PostCardTitle({ post }: { post: Post, }): JSX.Element {
    const linkUrl = `${import.meta.env.VITE_APP_URL}/post/${post.id}`

    return (
        <Card>
            <CardHeader
            avatar="Avatar"
            title={
                <Link 
                href={linkUrl} 
                color="inherit" 
                sx={{ fontWeight: "bold" }}
                >
                    {post.title}
                </Link>
            }
            subheader={post.category}
            />
        </Card>
    )
}

/**
 * A list view of forum posts.
 * @param {Object} props = Properties passed to the Posts component.
 * @param {Post[]} props.posts - Array of Post to be displayed.
 * @returns {JSX.Element} A component containing the forum posts.
 */
function Posts({ posts }: { posts: Post[] }): JSX.Element {
    return (
        <Box bgcolor="green" flex={3} >
            {posts.map(post => (
                <PostCardTitle key={post.id} post={post}/>
            ))}
        </Box>
    )
}

/**
 * A right bar containing other information(?)
 * @returns {JSX.Element} A component containing the right bar of the Feed.
 */
function RightBar(): JSX.Element {
    return (
        <Box bgcolor="purple" flex={1}>
            RightBar
        </Box>
    )
}

/**
 * The main feature of our app.
 * Displays all forum posts, that can be filtered based on category and search keywords.
 * @param {Object} props - Properties passed to the Feed component.
 * @param {Post[]} props.posts - Array of Post to be displayed.
 * @returns {JSX.Element} A component that displays the Feed.
 */
export default function Feed({ posts }: { posts: Post[] }): JSX.Element {
    return (
        <Stack>
            <CategoryHeader />
            <Stack direction="row" justifyContent="space-between">
                <Posts posts={posts}/>
                <RightBar />
            </Stack>
        </Stack>
       
    )
}