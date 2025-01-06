import { createContext, useContext, useState } from "react";
import Comment from "../../features/comment/comment-types";

// Define context
const IsEditCommentOpenContext = createContext<{
    isEditCommentOpen: boolean,
    toggleEditCommentOpen: (comment?: Comment) => void,
    comment: Comment | null,
}
>({
    // Default values
    isEditCommentOpen: false,
    toggleEditCommentOpen: () => {},
    comment: null,
});

// Provider
export const IsEditCommentOpenProvider = ({ children }: {
    children: React.ReactNode,
}): JSX.Element => {
    // Initial values
    const [isEditCommentOpen, setIsEditCommentOpen] = useState(false);
    const [comment, setComment] = useState<Comment | null>(null);

    const toggleEditCommentOpen = (comment?: Comment) => {
        setIsEditCommentOpen(prev => !prev);
        setComment(comment ?? null);
    };

    return (
        <IsEditCommentOpenContext.Provider value={{
            isEditCommentOpen,
            toggleEditCommentOpen,
            comment,
        }}>
            {children}
        </IsEditCommentOpenContext.Provider>
    );
}

// Hook to consume context
export const useIsEditCommentOpen = () => {
    return useContext(IsEditCommentOpenContext);
}