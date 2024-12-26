import { createContext, useContext, useState } from "react";

// Define context
const IsCreateOpenContext = createContext(
    {
        isCreateOpen: false,
        toggleCreateOpen: () => {}
    }
)

// Provider
export const IsCreateOpenProvider = ({ children }: {
    children: React.ReactNode
}) => {
    // set context values for consumers (components wrapped by this provider)
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const toggleCreateOpen = (): void => {
        setIsCreateOpen(prev => !prev);
    };

    return (
        <IsCreateOpenContext.Provider value={{
            isCreateOpen,
            toggleCreateOpen
        }}
        >
            {children}
        </IsCreateOpenContext.Provider>
    );
};

// Custom hook to access (consume) content
export const useIsCreateOpen = () => {
    return useContext(IsCreateOpenContext);
}