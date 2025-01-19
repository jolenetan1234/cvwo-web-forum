import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store/store";


// INITIAL STATE
const initialState = {
    theme: 'dark',
}

// SLICE
const themeSlice = createSlice({
    name: 'theme', // prefix for action types
    initialState,
    reducers: {
        toggleTheme: (state) => {
            if (state.theme === 'light') {
                state.theme = 'dark';
                localStorage.setItem('theme', 'dark');
            } else {
                state.theme = 'light';
                localStorage.setItem('theme', 'light');
            }
        },
        restoreTheme: (state) => {
            // obtain theme from local storage
            const prevTheme = localStorage.getItem('theme') ?? 'dark';
            state.theme = prevTheme;
            localStorage.setItem('theme', prevTheme);
        } 
    }
});

// EXPORTS
// Export action creators
export const { toggleTheme, restoreTheme } = themeSlice.actions;
// Export reducer for use in store config
export default themeSlice.reducer;
// Export selectors
export const selectTheme = (state: RootState) => state.theme.theme;
// Export types