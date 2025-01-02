import { createContext, ReactNode, useContext, useState } from "react";

// Define context
const IsLoginOpenContext = createContext(
    // DEFAULT VALUE (fallback if eg. someone tries to consume this context outside its scope)
    {
        isLoginOpen: false,
        toggleLoginOpen: () => {}
    }
);

// Create provider component
export const IsLoginOpenProvider = ({ children }: {
    children: ReactNode
}) => {
    // set context values for consumers (components wrapped by this provider)
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const toggleLoginOpen = (): void => {
        setIsLoginOpen(prev => !prev); // Toggle state
    };

    return (
        <IsLoginOpenContext.Provider value={{
            isLoginOpen,
            toggleLoginOpen
        }}
        >
            {children}
        </IsLoginOpenContext.Provider>
    );
}

// Custom hook to access (consume) content
export const useIsLoginOpen = () => {
    return useContext(IsLoginOpenContext);
}