import { createContext, useContext, useState } from "react";

// Define context
const IsEditCommentOpenContext = createContext({
    // Default values
    isEditCommentOpen: false,
    toggleEditCommentOpen: () => {},
});

// Provider
export const IsEditCommentOpenProvider = ({ children }: {
    children: React.ReactNode,
}): JSX.Element => {
    // Initial values
    const [isEditCommentOpen, setIsEditCommentOpen] = useState(false);

    const toggleEditCommentOpen = () => {
        setIsEditCommentOpen(prev => !prev);
    };

    return (
        <IsEditCommentOpenContext.Provider value={{
            isEditCommentOpen,
            toggleEditCommentOpen,
        }}>
            {children}
        </IsEditCommentOpenContext.Provider>
    );
}

// Hook to consume context
export const useIsEditCommentOpen = () => {
    return useContext(IsEditCommentOpenContext);
}