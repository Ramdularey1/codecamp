// import { configureStore} from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import { combineReducers } from 'redux';
// import allProblemSlice from "./allProblemSlice";
// import currentProblem from "./currentProblem";

// const rootReducer = combineReducers({
//   allproblems: allProblemSlice,
//   currentProblem: currentProblem
// });

// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['allproblems', 'currentProblem'] // Only persist these slices
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = configureStore({
//   reducer: persistedReducer
// });

// const persistor = persistStore(store);

// export { store, persistor };






import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import allProblemSlice from './allProblemSlice';
import currentProblem from './currentProblem';
import { combineReducers } from 'redux';

// Create the persist config
const persistConfig = {
  key: 'root',
  storage,
};

// Combine reducers
const rootReducer = combineReducers({
  allproblems: allProblemSlice,
  currentProblem: currentProblem,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with custom middleware
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create the persistor
const persistor = persistStore(store);

export { store, persistor };
