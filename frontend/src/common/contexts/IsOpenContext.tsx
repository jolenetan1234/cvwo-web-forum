import { createContext, ReactNode, useContext, useState } from "react";

// Define context
const IsOpenContext = createContext(
    {
        isOpen: false,
        toggleOpen: () => {}
    }
);

// Create provider component
export const IsOpenProvider = ({ children }: {
    children: ReactNode
}) => {
    // set context values for consumers (components wrapped by this provider)
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = (): void => {
        setIsOpen(prev => !prev); // Toggle state
    };

    return (
        <IsOpenContext.Provider value={{
            isOpen,
            toggleOpen
        }}
        >
            {children}
        </IsOpenContext.Provider>
    );
}

// Custom hook to access (consume) content
export const useIsOpen = () => {
    return useContext(IsOpenContext);
}