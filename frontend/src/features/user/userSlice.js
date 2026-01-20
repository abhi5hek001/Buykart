import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Cookie configuration for security
const COOKIE_OPTIONS = {
    expires: 30, // 30 days
    secure: true, // Only send over HTTPS
    sameSite: 'strict', // Prevent CSRF
};

// Load current user from cookies
const loadUserFromStorage = () => {
    try {
        const savedUser = Cookies.get('buykart_current_user');
        return savedUser ? JSON.parse(savedUser) : null;
    } catch {
        return null;
    }
};

// Save current user to cookies
const saveUserToStorage = (user) => {
    try {
        if (user) {
            Cookies.set('buykart_current_user', JSON.stringify(user), COOKIE_OPTIONS);
        } else {
            Cookies.remove('buykart_current_user');
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
