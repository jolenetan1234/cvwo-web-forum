import { useParams } from "react-router-dom";
import Post from "../../types/Post";
import React from "react";

// contains Card, and all the id-related stuff for one user only.
export function PostCardDetails({ getPostById, Error }: { 
    getPostById: (postId: number) => Post,
    Error: React.FC }): JSX.Element {
    /**
     * Post = fetchPost();
     */
    const params = useParams<{ id : string }>();
    const postId = params.id;

    // Handle case where postId is undefined
    if (!postId) {
        return <Error />;
    }

    const post = getPostById(parseInt(postId));

    return (
        <>PostCardDetail for post {postId}</>
    )
}