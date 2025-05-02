import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('favorites')) || [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite(state, action) {
      state.items.push(action.payload);
      localStorage.setItem('favorites', JSON.stringify(state.items));
    },
    removeFavorite(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload.id);
      localStorage.setItem('favorites', JSON.stringify(state.items));
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;