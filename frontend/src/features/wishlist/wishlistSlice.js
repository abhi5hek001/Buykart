import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Cookie configuration for security
const COOKIE_OPTIONS = {
    expires: 30, // 30 days
    secure: true, // Only send over HTTPS
    sameSite: 'strict', // Prevent CSRF
};

// Get storage key for specific user
const getStorageKey = (userId) => `buykart_wishlist_${userId || 'guest'}`;

// Load wishlist from cookies for a specific user
const loadWishlistFromStorage = (userId) => {
    try {
        const saved = Cookies.get(getStorageKey(userId));
        return saved ? JSON.parse(saved) : { items: [], userId: userId || null };
    } catch {
        return { items: [], userId: userId || null };
    }
};

// Save wishlist to cookies
const saveWishlistToStorage = (wishlist) => {
    try {
        const key = getStorageKey(wishlist.userId);
        Cookies.set(key, JSON.stringify(wishlist), COOKIE_OPTIONS);
    } catch (error) {
        console.error('Failed to save wishlist:', error);
    }
};

// Try to load from current user in cookies
const loadInitialState = () => {
    try {
        const savedUser = Cookies.get('buykart_current_user');
        const user = savedUser ? JSON.parse(savedUser) : null;
        return loadWishlistFromStorage(user?.id);
    } catch {
        return { items: [], userId: null };
    }
};

const initialState = loadInitialState();

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

        // Switch wishlist when user changes
        switchUserWishlist: (state, action) => {
            const userId = action.payload;
            const loaded = loadWishlistFromStorage(userId);
            state.items = loaded.items;
            state.userId = userId;
        },
    },
});

export const { addToWishlist, removeFromWishlist, clearWishlist, toggleWishlist, switchUserWishlist } = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectIsInWishlist = (id) => (state) =>
    state.wishlist.items.some((item) => item.id === id);

export default wishlistSlice.reducer;
