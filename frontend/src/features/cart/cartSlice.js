import { createSlice } from '@reduxjs/toolkit';

// Get storage key for specific user
const getStorageKey = (userId) => `buykart_cart_${userId || 'guest'}`;

// Load cart from localStorage for a specific user
const loadCartFromStorage = (userId) => {
    try {
        const savedCart = localStorage.getItem(getStorageKey(userId));
        return savedCart ? JSON.parse(savedCart) : { items: [], totalQuantity: 0, subtotal: 0, userId: userId || null };
    } catch {
        return { items: [], totalQuantity: 0, subtotal: 0, userId: userId || null };
    }
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
    try {
        const key = getStorageKey(cart.userId);
        localStorage.setItem(key, JSON.stringify(cart));
    } catch (error) {
        console.error('Failed to save cart:', error);
    }
};

// Try to load from current user in localStorage
const loadInitialState = () => {
    try {
        const savedAuth = localStorage.getItem('buykart_auth');
        const auth = savedAuth ? JSON.parse(savedAuth) : null;
        // Ensure we only load data for string IDs (new format)
        return loadCartFromStorage(typeof auth?.user?.id === 'string' ? auth.user.id : null);
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

// Listener to sync cart changes across tabs
export const setupCartListeners = () => (dispatch, getState) => {
    window.addEventListener('storage', (e) => {
        const userId = getState().user.currentUser?.id || 'guest';
        const storageKey = `buykart_cart_${userId}`;

        if (e.key === storageKey) {
            const newCart = e.newValue ? JSON.parse(e.newValue) : null;
            if (newCart) {
                dispatch(switchUserCart(userId));
            }
        }
    });
};

export default cartSlice.reducer;
