import { createSlice } from '@reduxjs/toolkit';

// Load current user from localStorage
const loadUserFromStorage = () => {
    try {
        const savedUser = localStorage.getItem('buykart_current_user');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            // Validation: Ensure ID is a string (part of the new production ID scheme)
            // If it's a number (legacy), clear it to force a fresh selection
            if (typeof user?.id !== 'string') {
                localStorage.removeItem('buykart_current_user');
                return null;
            }
            return user;
        }
        return null;
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

// Thunk to initialize listeners
export const setupUserListeners = () => (dispatch) => {
    window.addEventListener('storage', (e) => {
        if (e.key === 'buykart_current_user') {
            const newUser = e.newValue ? JSON.parse(e.newValue) : null;
            dispatch(setCurrentUser(newUser));
        }
    });
};

export default userSlice.reducer;
