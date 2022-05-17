import { configureStore } from "@reduxjs/toolkit";
import workflowReducer from './features/workflow';

export const store = configureStore({
    reducer: {
        workflow: workflowReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
