import { createSlice } from '@reduxjs/toolkit';

// Get storage key for specific user
const getStorageKey = (userId) => `buykart_wishlist_${userId || 'guest'}`;

// Load wishlist from localStorage for a specific user
const loadWishlistFromStorage = (userId) => {
    try {
        const saved = localStorage.getItem(getStorageKey(userId));
        return saved ? JSON.parse(saved) : { items: [], userId: userId || null };
    } catch {
        return { items: [], userId: userId || null };
    }
};

// Save wishlist to localStorage
const saveWishlistToStorage = (wishlist) => {
    try {
        const key = getStorageKey(wishlist.userId);
        localStorage.setItem(key, JSON.stringify(wishlist));
    } catch (error) {
        console.error('Failed to save wishlist:', error);
    }
};

// Try to load from current user in localStorage
const loadInitialState = () => {
    try {
        const savedUser = localStorage.getItem('buykart_current_user');
        const user = savedUser ? JSON.parse(savedUser) : null;
        // Ensure we only load data for string IDs (new format)
        return loadWishlistFromStorage(typeof user?.id === 'string' ? user.id : null);
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

// Listener to sync wishlist changes across tabs
export const setupWishlistListeners = () => (dispatch, getState) => {
    window.addEventListener('storage', (e) => {
        const userId = getState().user.currentUser?.id || 'guest';
        const storageKey = `buykart_wishlist_${userId}`;

        if (e.key === storageKey) {
            const newWishlist = e.newValue ? JSON.parse(e.newValue) : null;
            if (newWishlist) {
                dispatch(switchUserWishlist(userId));
            }
        }
    });
};

export default wishlistSlice.reducer;
