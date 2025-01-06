import { configureStore } from "@reduxjs/toolkit";

// reducers
import userReducer from "../features/user/user-slice";
import postsReducer from "../features/post/post-slice";
import commentsReducer from "../features/comment/comment-slice";
import themeReducer from "../features/theme/theme-slice";

// the redux store.
export const store = configureStore({
    // the root reducer.
    reducer: {
        user: userReducer,
        posts: postsReducer,
        comments: commentsReducer,
        theme: themeReducer,
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