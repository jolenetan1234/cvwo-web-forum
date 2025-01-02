import { createContext, useContext, useState } from "react";

// Define context
const IsDeleteCommentOpenContext = createContext<{
    isDeleteCommentOpen: boolean,
    toggleDeleteCommentOpen: (commentId?: string) => void,
    commentId: string | null,
}
>({
    isDeleteCommentOpen: false,
    toggleDeleteCommentOpen: (commentId?:  string) => {},
    commentId: null,
});

// Context provider
export const IsDeleteCommentOpenProvider = ({ children }: { 
    children: React.ReactNode
}): JSX.Element => {
    const [isDeleteCommentOpen, setIsDeleteCommentOpen] = useState(false);
    const [commentId, setCommentId] = useState<string | null>(null);
    
    const toggleDeleteCommentOpen = (commentId?: string) => {
        console.log("EOIRHEOIHR")
        setIsDeleteCommentOpen(prev => !prev);
        setCommentId(commentId ?? null);
    }

    return (
        <IsDeleteCommentOpenContext.Provider value={{
            isDeleteCommentOpen,
            toggleDeleteCommentOpen,
            commentId
        }}>
            {children}
        </IsDeleteCommentOpenContext.Provider>
    )
}

// Hook to access (consume) context
export const useIsDeleteCommentOpen = () => {
    return useContext(IsDeleteCommentOpenContext);
}