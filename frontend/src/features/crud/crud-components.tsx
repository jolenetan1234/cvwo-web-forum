import { useParams } from "react-router-dom";
import Post from "../../types/Post";
import { Box, Card, CardContent, CardHeader, Chip, Stack, Typography } from "@mui/material";

// contains Card, and all the id-related stuff for one user only.
export function PostCardDetails({ getPostById, ErrorComponent }: { 
    getPostById: (postId: number) => Post,
    ErrorComponent: ({ message }: { message: string }) => JSX.Element }): JSX.Element {
    const params = useParams<{ id : string }>();
    const postId = params.id;

    // Handle case where postId is undefined
    if (!postId) {
        return <ErrorComponent message="undefined postID in params"/>;
    }

    try {
        const post = getPostById(parseInt(postId));

        // Return a Card representation of the post.
        return (
            <Box>
                <Card sx={{ mt: 1 }}>
                    {/* Post Title */}
                    <CardHeader
                    title={
                        <Stack direction="row" alignItems="center">

                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                {post.title}
                            </Typography>

                            <Chip
                                label={post.category}
                                size="small"
                                color="primary"
                                sx={{ ml: 1 }} // Add some margin to the left
                            />
                        </Stack>
                    }
                    />

                    {/* Post Content */}
                    <CardContent sx={{ mt: -3 }}>
                        <Typography>
                            {post.content}
                        </Typography>
                    </CardContent>
                </Card>

                {/* Comments section */}
                
        </Box>
        );

    } catch (err) {
        return <ErrorComponent message={err.toString()}/>
    }
}