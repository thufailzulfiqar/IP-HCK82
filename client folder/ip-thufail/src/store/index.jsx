import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './slices/FavoriteSlices';

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
  },
});
