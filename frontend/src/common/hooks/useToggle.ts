import { useState } from "react";

const useToggle = (initialState = false): {
    isOpen: boolean,
    toggle: () => void,
    open: () => void,
    close: () => void,
} => {
    // set state
    const [isOpen, setIsOpen] = useState(initialState);

    const toggle = (): void => {
        setIsOpen(!isOpen);
    }
    const open = (): void => {
        setIsOpen(true);
    }
    const close = (): void => {
        setIsOpen(false);
    }

    return { isOpen, toggle, open, close };
}

export default useToggle;