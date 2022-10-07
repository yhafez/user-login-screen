import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'

import authReducer from './actions/auth'

export const rootReducer = combineReducers({
	auth: authReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const store = configureStore({
	reducer: rootReducer,
})

export type AppDispatch = typeof store.dispatch

export default store
