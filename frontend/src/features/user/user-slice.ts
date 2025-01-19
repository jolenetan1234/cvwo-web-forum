import Cookies from "js-cookie";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import User from "./user-types";
import { RootState } from "../../store/store"

// `userReducer` of `userSlice` will only be responsible for these states.
/**
 * @interface UserState
 * @property {User | null} user - The object representing the logged in user.
 * @property {string | null} token - The authentication token given to the user.
 * @property {boolean} isLoggedIn - The flag indicating whether the user is logged in.
 */
interface UserState {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
}

const initialState: UserState = {
    user: null,
    token: null,
    isLoggedIn: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    // defines `userReducer`, ie. (state, action) => state
    reducers: {
        // simply provide the name of the ACTION CREATOR
        // with (state, action) as arguments => 
        // redux-toolkit will automatically make them into actions like `<name>/<reducer-name>`
        // then "mutate" the state accordingly.
        // NOTE: this mutation in state is handled and made immutable by Immer.

        // NOTE: if `action` not passed in as paramter => tkaen to be a simple action
        // like `{ 'type': 'user/logout' } with no `payload`.

        // the name `login` means when we call `login()`,
        // it will return the `LOGIN action = { type: user/LOGIN, payload: { user, token }`
        // which can be dispatched to the store
        // and be handled by this reducer.
        login: (state, action: PayloadAction<{
            user: User;
            token: string;
        }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.user = null;
            state.token = null; 
            state.isLoggedIn = false;
        },
        restoreSession: (state) => {
            // obtain user & token from cookies
            const user = Cookies.get('user') ? JSON.parse(Cookies.get('user') ?? "") : null;
            const token = Cookies.get('token') || null;
            if (user && token) {
                state.user = user;
                state.token = token;
                state.isLoggedIn = true;
            }
        }
    },
});

// Export the generated action creators for use in components
export const { login, logout, restoreSession } = userSlice.actions;

// Export the slice reducer for use in store config
export default userSlice.reducer;

// Export selectors
export const selectUser = (state: RootState) => state.user.user;
export const selectUserIsLoggedIn = (state: RootState) => state.user.isLoggedIn;
export const selectUserToken = (state: RootState) => state.user.token;

// Export types
export type { UserState };