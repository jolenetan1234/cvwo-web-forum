import { useParams } from "react-router-dom";

// contains Card, and all the id-related stuff for one user only.
export function PostCardDetails(): JSX.Element {
    /**
     * fetch Post
     */
    const params = useParams<{ id : string }>();
    const postId = params.id;

    return (
        <>PostCardDetail for post {postId}</>
    )
}