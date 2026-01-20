import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Cookie configuration for security
const COOKIE_OPTIONS = {
    expires: 30, // 30 days
    secure: true, // Only send over HTTPS
    sameSite: 'strict', // Prevent CSRF
};

// Get storage key for specific user
const getStorageKey = (userId) => `buykart_cart_${userId || 'guest'}`;

// Load cart from cookies for a specific user
const loadCartFromStorage = (userId) => {
    try {
        const savedCart = Cookies.get(getStorageKey(userId));
        return savedCart ? JSON.parse(savedCart) : { items: [], totalQuantity: 0, subtotal: 0, userId: userId || null };
    } catch {
        return { items: [], totalQuantity: 0, subtotal: 0, userId: userId || null };
    }
};

// Save cart to cookies
const saveCartToStorage = (cart) => {
    try {
        const key = getStorageKey(cart.userId);
        Cookies.set(key, JSON.stringify(cart), COOKIE_OPTIONS);
    } catch (error) {
        console.error('Failed to save cart:', error);
    }
};

// Try to load from current user in cookies
const loadInitialState = () => {
    try {
        const savedUser = Cookies.get('buykart_current_user');
        const user = savedUser ? JSON.parse(savedUser) : null;
        return loadCartFromStorage(user?.id);
    } catch {
        return { items: [], totalQuantity: 0, subtotal: 0, userId: null };
    }
};

const initialState = loadInitialState();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { id, name, price, imageUrl, quantity = 1 } = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({
                    id,
                    name,
                    price: Number(price),
                    imageUrl,
                    quantity,
                });
            }

            // Recalculate totals
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            state.subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);

            saveCartToStorage(state);
        },

        removeFromCart: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter((item) => item.id !== id);

            // Recalculate totals
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            state.subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);

            saveCartToStorage(state);
        },

        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find((item) => item.id === id);

            if (item) {
                if (quantity <= 0) {
                    state.items = state.items.filter((i) => i.id !== id);
                } else {
                    item.quantity = quantity;
                }
            }

            // Recalculate totals
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            state.subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);

            saveCartToStorage(state);
        },

        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.subtotal = 0;

            saveCartToStorage(state);
        },

        // Switch cart when user changes
        switchUserCart: (state, action) => {
            const userId = action.payload;
            const loaded = loadCartFromStorage(userId);
            state.items = loaded.items;
            state.totalQuantity = loaded.totalQuantity;
            state.subtotal = loaded.subtotal;
            state.userId = userId;
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, switchUserCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalQuantity = (state) => state.cart.totalQuantity;
export const selectCartSubtotal = (state) => state.cart.subtotal;

export default cartSlice.reducer;
