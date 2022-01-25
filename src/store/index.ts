import { FileReducer, FreezeReducer, StateReducer, UserReducer } from './reducers';
import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const rootReducer = combineReducers({
  UserReducer,
  FileReducer,
  FreezeReducer,
  StateReducer,
});

const middleware = getDefaultMiddleware({
  immutableCheck: false,
  serializableCheck: false,
  thunk: true,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware,
  });
};

/* typed dispatch and selector */
export const useTypedDispatch = () => useDispatch<DispatchType>();
export const useTypedSelector: TypedUseSelectorHook<RootStateType> = useSelector;

export type RootStateType = ReturnType<typeof rootReducer>;
export type StoreType = ReturnType<typeof setupStore>;
export type DispatchType = StoreType['dispatch'];
