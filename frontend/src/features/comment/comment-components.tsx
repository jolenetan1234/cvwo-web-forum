function CommentCard({ commentId, getCommentById, ErrorComponent }: { 
    commentId: number, 
    getCommentById: (commentId: number) => Comment,
    ErrorComponent: ({ message }: {message: string }) => JSX.Element
}): JSX.Element {
    // Fetch the Comment.
    try {
        const comment = getCommentById(commentId);
        console.log(comment);
    
        return (
            <>Comment</>
        );
    } catch (err) {
        return (
            <ErrorComponent message={err.toString()} />
        );
    }
}