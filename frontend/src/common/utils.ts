import Comment from "../features/comment/comment-types";
import Post from "../features/post/post-types"

/**
 * Checks if an item has been edited
 * by checking `item.created_at` and `item.updated_at`.
 * 
 * @parm {Post | Comment} item
 *  
 */
export const isEdited = (item: Post | Comment) => {
    return item.created_at != item.updated_at;
}

/** 
 * Compares two objects to determine if they have at least one differing property value.
 * Only the properties of `obj1` will be compared.
 * Mainly for use in EditForm hooks.
 * 
 * @param {object} obj1 - The first object to compare.
 * @param {object} obj2 - The second object to compare.
 * @returns {boolean} - Returns `true` if at least one property in `obj1` has a different value in `obj2`, otherwise `false`.
 */
export const isDifferent = (obj1: object, obj2: object) => {
    for (const key in obj1) {
        // check that at least one of these attributees is different
        if (obj1[key as keyof object] != obj2[key as keyof object]) {
            return true;
        }
    }
    return false;
}