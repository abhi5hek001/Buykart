import { createSlice } from '@reduxjs/toolkit';

// Load current user from localStorage
const loadUserFromStorage = () => {
    try {
        const savedUser = localStorage.getItem('buykart_current_user');
        return savedUser ? JSON.parse(savedUser) : null;
    } catch {
        return null;
    }
};

// Save current user to localStorage
const saveUserToStorage = (user) => {
    try {
        if (user) {
            localStorage.setItem('buykart_current_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('buykart_current_user');
        }
    } catch (error) {
        console.error('Failed to save user:', error);
    }
};

const initialState = {
    currentUser: loadUserFromStorage(),
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
            saveUserToStorage(action.payload);
        },
        clearCurrentUser: (state) => {
            state.currentUser = null;
            saveUserToStorage(null);
        },
    },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.user.currentUser;

export default userSlice.reducer;
