import { createContext, useContext, useState } from "react";

// define context
const IsDeletePostOpenContext = createContext<{
    isDeletePostOpen: boolean,
    toggleDeletePostOpen: (postId?: string) => void,
    postId: string | null
}
>({
    isDeletePostOpen: false,
    toggleDeletePostOpen: () => {},
    postId: ''
});

// context provider
export const IsDeletePostOpenProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    // initial values
    const [isDeletePostOpen, setIsDeletePostOpen] = useState(false);
    const [postId, setPostId] = useState<string | null>(null);

    const toggleDeletePostOpen = (postId?: string) => {
        console.log("[IsDeletePostOpenContext: toggleDeletePostOpen] isDeletePostOpen", isDeletePostOpen);
        setIsDeletePostOpen(prev => !prev);
        setPostId(postId ?? null);
    }

    return (
        <IsDeletePostOpenContext.Provider value={{
            isDeletePostOpen,
            toggleDeletePostOpen,
            postId
        }}>
            {children}
        </IsDeletePostOpenContext.Provider>
    )
}

// hook to access (consume) context
export const useIsDeletePostOpen = () => {
    return useContext(IsDeletePostOpenContext);
}