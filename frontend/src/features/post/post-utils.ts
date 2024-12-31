import { useAppSelector } from "../../store/store-hooks"
import Comment from "../comment/comment-types";
import { selectUser, selectUserIsLoggedIn } from "../user/user-slice"
import Post from "./post-types"

/**
 * 
 * @param item - A Post or Comment.
 * @returns true if the logged in user is the author of the Post or Comment.
 */
export const isAuthor = (item: Post | Comment) => {
    const userId = useAppSelector(selectUser)?.id;
    const isLoggedIn = useAppSelector(selectUserIsLoggedIn);

    return userId === item.user_id && isLoggedIn;
}