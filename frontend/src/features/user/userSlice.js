import { createSlice } from '@reduxjs/toolkit';

// Load auth state from localStorage
const loadAuthFromStorage = () => {
    try {
        const savedAuth = localStorage.getItem('buykart_auth');
        if (savedAuth) {
            const auth = JSON.parse(savedAuth);
            // Validation: Ensure user ID is a string (part of the new production ID scheme)
            if (typeof auth.user?.id !== 'string' || !auth.token) {
                localStorage.removeItem('buykart_auth');
                return { currentUser: null, token: null };
            }
            return { currentUser: auth.user, token: auth.token };
        }
        return { currentUser: null, token: null };
    } catch {
        return { currentUser: null, token: null };
    }
};

// Save auth state to localStorage
const saveAuthToStorage = (user, token) => {
    try {
        if (user && token) {
            localStorage.setItem('buykart_auth', JSON.stringify({ user, token }));
        } else {
            localStorage.removeItem('buykart_auth');
        }
    } catch (error) {
        console.error('Failed to save auth:', error);
    }
};

const initialState = loadAuthFromStorage();

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.currentUser = user;
            state.token = token;
            saveAuthToStorage(user, token);
        },
        logout: (state) => {
            state.currentUser = null;
            state.token = null;
            saveAuthToStorage(null, null);
        },
    },
});

export const { setCredentials, logout } = userSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectToken = (state) => state.user.token;
export const selectIsAuthenticated = (state) => !!state.user.token;

// Thunk to initialize listeners for cross-tab sync
export const setupUserListeners = () => (dispatch) => {
    window.addEventListener('storage', (e) => {
        if (e.key === 'buykart_auth') {
            const newAuth = e.newValue ? JSON.parse(e.newValue) : null;
            if (newAuth) {
                dispatch(setCredentials({ user: newAuth.user, token: newAuth.token }));
            } else {
                dispatch(logout());
            }
        }
    });
};

export default userSlice.reducer;
