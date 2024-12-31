import { createContext, useContext, useState } from "react";

// Define context
const IsEditPostOpenContext = createContext(
    {
        // DEFAULT VALUES (fallback if eg. someone tires to consume this context outside its scope)
        isEditPostOpen: false,
        toggleEditPostOpen: (postId?: string) => {}, // optional postId
        postId: ''
    }
);

// Provider
export const IsEditPostOpenProvider = ({ children }: {
    children: React.ReactNode
}) => {
    // Initialise values
    const [isEditPostOpen, setIsEditPostOpen] = useState(false);
    const [postId, setPostId] = useState<string>('');

    const toggleEditPostOpen = (postId: string) => {
        setIsEditPostOpen(prev => !prev);
        setPostId(postId ?? null);
    }

    return (
        <IsEditPostOpenContext.Provider value={{
            isEditPostOpen,
            toggleEditPostOpen,
            postId
        }}
        >
            {children}
        </IsEditPostOpenContext.Provider>
    );
}

// Custom hook to access (consume) context
export const useIsEditPostOpen = () => {
    return useContext(IsEditPostOpenContext);
}