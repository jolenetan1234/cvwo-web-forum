import { createContext, useContext, useState } from "react";

// define context
const IsDeletePostOpenContext = createContext<{
    isDeletePostOpen: boolean,
    toggleDeletePostOpen: (postId?: string) => void,
    postId: string
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
    const [postId, setPostId] = useState('');

    const toggleDeletePostOpen = (postId?: string) => {
        setIsDeletePostOpen(prev => !prev);
        setPostId(postId ?? '');
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