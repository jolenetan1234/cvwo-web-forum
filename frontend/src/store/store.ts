import { configureStore } from "@reduxjs/toolkit";

// reducers
import userReducer from "../features/user/user-slice";

// the redux store.
export const store = configureStore({
    // the root reducer.
    reducer: {
        user: userReducer,
    }
}
)

// Export types for use later on
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;