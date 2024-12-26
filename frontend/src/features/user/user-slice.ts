import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import { User } from "./user-types";
import { RootState } from "../../store/store"

// `userReducer` of `userSlice` will only be responsible for these states.
interface UserState {
    user: {
        id: number;
        username: string;
        token: string;
    } | null;
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
        // with (state, action) as arguments
        // then "mutate" the state accordingly.
        // NOTE: this mutation in state is handled and made immutable by Immer.

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
        logout: state => {
            state.user = null;
            state.token = null; 
            state.isLoggedIn = false;
        },
    },
});

// Export the generated action creators for use in components
export const { login, logout } = userSlice.actions;

// Export the slice reducer for use in store config
export default userSlice.reducer;

// Export selectors
export const selectUser = (state: RootState) => state.user.user;
export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;