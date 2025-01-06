import { createContext, useContext, useState } from "react";

// Define context
const IsCreateCommentOpenContext = createContext({
    // default values 
    // (fallback in case eg. some component outside the context tree
    // tries to consume the context)
    isCreateCommentOpen: false,
    toggleCreateCommentOpen: () => {},
});

// Provider
const IsCreateCommentOpenProvider = ({ children }: {
    children: React.ReactNode
}): JSX.Element => {
    // initial values
    const [isCreateCommentOpen, setIsCreateCommentOpen] = useState(false);

    const toggleCreateCommentOpen = () => {
        setIsCreateCommentOpen(prev => !prev);
    };

    return (
        <IsCreateCommentOpenContext.Provider value={{
            isCreateCommentOpen,
            toggleCreateCommentOpen,
        }}>
            {children}
        </IsCreateCommentOpenContext.Provider>
    )
}

// Hook to access (consume) context
const useIsCreateCommentOpen = () => {
    return useContext(IsCreateCommentOpenContext);
}

export { IsCreateCommentOpenProvider, useIsCreateCommentOpen };