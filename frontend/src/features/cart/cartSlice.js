import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCartFromStorage = () => {
    try {
        const savedCart = localStorage.getItem('buykart_cart');
        return savedCart ? JSON.parse(savedCart) : { items: [], totalQuantity: 0, subtotal: 0 };
    } catch {
        return { items: [], totalQuantity: 0, subtotal: 0 };
    }
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
    try {
        localStorage.setItem('buykart_cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Failed to save cart:', error);
    }
};

const initialState = loadCartFromStorage();

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
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalQuantity = (state) => state.cart.totalQuantity;
export const selectCartSubtotal = (state) => state.cart.subtotal;

export default cartSlice.reducer;
