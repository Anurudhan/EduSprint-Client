import { configureStore } from "@reduxjs/toolkit"
import { userReducer } from "./store/slices/user"

export const store = configureStore ({
    reducer: {
        user: userReducer
    }
})

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType < typeof store.getState >