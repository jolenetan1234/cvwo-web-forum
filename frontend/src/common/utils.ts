import { useAppSelector } from "../store/store-hooks"
import Comment from "../features/comment/comment-types";
import { selectUser, selectUserIsLoggedIn } from "../features/user/user-slice"
import Post from "../features/post/post-types"

/**
 * For use in components.
 * @param item - A Post or Comment.
 * @returns true if the logged in user is the author of the Post or Comment.
 */
export const isAuthor = (item: Post | Comment) => {
    const userId = useAppSelector(selectUser)?.id;
    const isLoggedIn = useAppSelector(selectUserIsLoggedIn);

    return userId === item.user_id && isLoggedIn;
}