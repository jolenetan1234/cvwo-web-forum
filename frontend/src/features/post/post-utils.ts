import { useAppSelector } from "../../store/store-hooks"
import Comment from "../comment/comment-types";
import { selectUser, selectUserIsLoggedIn } from "../user/user-slice"
import Post from "./post-types"

export function useUtils() {
    const userId = useAppSelector(selectUser)?.id;
    const isLoggedIn = useAppSelector(selectUserIsLoggedIn);

    const isAuthor = (item: Post | Comment) => userId == item.user_id && isLoggedIn;
    
    return { isAuthor } 
}
