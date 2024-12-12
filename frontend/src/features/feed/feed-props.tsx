// DELETE LATER. I THINK WE DON'T NEED THIS FILE
import Post from "../../types/Post";

/**
 * Props for `Card` component.
 */
export interface CardProps {
    /**
     * Unique identifier for a post.
     */
    key: number;
    /**
     * The post for a card.
     */
    post: Post;
}

/**
 * Props for `Cards` component.
 */
export interface CardsProps {
    /**
     * Array of Posts. Each will be mapped to its own Card.
     */
    posts: Post[] 
}

/**
 * Props for `Feed` component.
 */
export default interface FeedProps {
    /**
     * Array of Posts to be displayed.
     */
    posts: Post[]
}