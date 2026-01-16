import { createSlice } from '@reduxjs/toolkit';

// Load wishlist from localStorage
const loadWishlistFromStorage = () => {
    try {
        const saved = localStorage.getItem('buykart_wishlist');
        return saved ? JSON.parse(saved) : { items: [] };
    } catch {
        return { items: [] };
    }
};

// Save wishlist to localStorage
const saveWishlistToStorage = (wishlist) => {
    try {
        localStorage.setItem('buykart_wishlist', JSON.stringify(wishlist));
    } catch (error) {
        console.error('Failed to save wishlist:', error);
    }
};

const initialState = loadWishlistFromStorage();

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addToWishlist: (state, action) => {
            const { id, name, price, imageUrl } = action.payload;
            const exists = state.items.find((item) => item.id === id);

            if (!exists) {
                state.items.push({ id, name, price, imageUrl, addedAt: new Date().toISOString() });
                saveWishlistToStorage(state);
            }
        },

        removeFromWishlist: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter((item) => item.id !== id);
            saveWishlistToStorage(state);
        },

        clearWishlist: (state) => {
            state.items = [];
            saveWishlistToStorage(state);
        },

        toggleWishlist: (state, action) => {
            const { id, name, price, imageUrl } = action.payload;
            const existingIndex = state.items.findIndex((item) => item.id === id);

            if (existingIndex >= 0) {
                state.items.splice(existingIndex, 1);
            } else {
                state.items.push({ id, name, price, imageUrl, addedAt: new Date().toISOString() });
            }
            saveWishlistToStorage(state);
        },
    },
});

export const { addToWishlist, removeFromWishlist, clearWishlist, toggleWishlist } = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectIsInWishlist = (id) => (state) =>
    state.wishlist.items.some((item) => item.id === id);

export default wishlistSlice.reducer;
