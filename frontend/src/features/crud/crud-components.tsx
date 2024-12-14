import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, Chip, Divider, Stack, Typography } from "@mui/material";
import NotFoundError from "../../common/errors/NotFoundError";
import CommentSection from "../comment/comment-components";
import ErrorMessage from "../../common/components/ErrorMessage";

// API calls
import { getPostById } from "../../api/post-api";

// contains Card, and all the id-related stuff for one user only.
export default function PostDetails(): JSX.Element {
    const params = useParams<{ id : string }>();
    const postId = params.id;

    // Handle case where postId is undefined
    if (!postId) {
        return <ErrorMessage message="undefined postID in params"/>;
    }

    try {
        const post = getPostById(parseInt(postId));

        // Return post details.
        return (
            <Card sx={{ mt: 1, ml: 2, mr: 2 }}>
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

                <Divider />
                {/* Comment Section */}
                <CardContent>
                    <CommentSection postId={parseInt(postId)}/>
                </CardContent>
            </Card> 
        );

    } catch (err) {
        // Set message based on error type
        let message;
        if (err instanceof NotFoundError) {
            message = err.toString();
        } else {
            message = "An unknown error occurred.";
        }

        return <ErrorMessage message={message}/>
    }
}