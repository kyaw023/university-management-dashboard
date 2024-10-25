import { configureStore } from "@reduxjs/toolkit";
import { ApiServices } from "./services/ApiServices";
import { authSlice } from "./slice/authSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    [ApiServices.reducerPath]: ApiServices.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(ApiServices.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

