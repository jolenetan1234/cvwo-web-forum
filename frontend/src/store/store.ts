import { configureStore } from "@reduxjs/toolkit";

// reducers
import userReducer from "../features/user/user-slice";
import postsReducer from "../features/post/post-slice";

// the redux store.
export const store = configureStore({
    // the root reducer.
    reducer: {
        user: userReducer,
        posts: postsReducer,
    }
}
)

// EXPORT TYPES FOR USE LATER ON
// Infer the type of `store`
export type AppStore = typeof store;
// Infer the type of the root state
export type RootState = ReturnType<typeof store.getState>;
// Infer the type of the app dispatch
export type AppDispatch = typeof store.dispatch;