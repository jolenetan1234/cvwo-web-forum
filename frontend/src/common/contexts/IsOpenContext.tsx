import { createContext, ReactNode, useContext, useState } from "react";

interface IsOpenContextType {
    isOpen: boolean;
    toggleOpen: () => void;
}

// Define context
const IsOpenContext = createContext<IsOpenContextType>(
    {
        isOpen: false,
        toggleOpen: () => {}
    }
);

// Create provider component
export const IsOpenProvider = ({ children }: {
    children: ReactNode
}) => {
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

// Custom hook for accessing the context
export const useIsOpen = (): IsOpenContextType => {
    return useContext(IsOpenContext);
}