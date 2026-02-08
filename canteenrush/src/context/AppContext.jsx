import React, { createContext, useContext, useState, useEffect, useReducer, useCallback } from 'react';
import api from '../api/axios';
import { connectSocket, disconnectSocket, getSocket } from '../api/socket';

// ─── Auth Context ───────────────────────────────────────────
const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

// ─── App Context (Cart, Vendors, Orders state) ─────────────
const AppContext = createContext(null);

const initialState = {
    selectedVendorId: null,
    cart: [],
    vendors: [],
    menuItems: [],
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_VENDORS':
            return { ...state, vendors: action.payload };

        case 'SET_MENU_ITEMS':
            return { ...state, menuItems: action.payload };

        case 'SELECT_VENDOR':
            return { ...state, selectedVendorId: action.payload, cart: [] };

        case 'ADD_TO_CART': {
            const existing = state.cart.find(c => c._id === action.payload._id);
            if (existing) {
                return {
                    ...state,
                    cart: state.cart.map(c =>
                        c._id === action.payload._id
                            ? { ...c, qty: c.qty + 1 }
                            : c
                    ),
                };
            }
            return { ...state, cart: [...state.cart, { ...action.payload, qty: 1 }] };
        }

        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cart: state.cart
                    .map(c =>
                        c._id === action.payload
                            ? { ...c, qty: c.qty - 1 }
                            : c
                    )
                    .filter(c => c.qty > 0),
            };

        case 'CLEAR_CART':
            return { ...state, cart: [] };

        default:
            return state;
    }
}

// ─── Combined Provider ──────────────────────────────────────
export function AppProvider({ children }) {
    // Auth state
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [authLoading, setAuthLoading] = useState(true);

    // App state
    const [state, dispatch] = useReducer(reducer, initialState);

    // Auth initialization
    useEffect(() => {
        if (token) {
            api.get('/auth/me')
                .then(res => {
                    setUser(res.data.user);
                    connectSocket();
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setToken(null);
                })
                .finally(() => setAuthLoading(false));
        } else {
            setAuthLoading(false);
        }
    }, [token]);

    // Fetch vendors on mount
    useEffect(() => {
        api.get('/vendors/all')
            .then(res => dispatch({ type: 'SET_VENDORS', payload: res.data.vendors }))
            .catch(console.error);
    }, []);

    // Auth functions
    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        connectSocket();
        return data.user;
    };

    const register = async (formData) => {
        const { data } = await api.post('/auth/register', formData);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        connectSocket();
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        disconnectSocket();
    };

    // Place order function
    const placeOrder = useCallback(async (vendorId, items) => {
        const { data } = await api.post('/orders', { vendorId, items });
        dispatch({ type: 'CLEAR_CART' });
        return data.order;
    }, []);

    // Load menu items for a vendor
    const loadVendorMenu = useCallback(async (vendorId) => {
        const { data } = await api.get(`/menu/vendor/${vendorId}`);
        dispatch({ type: 'SET_MENU_ITEMS', payload: data.items });
        return data.items;
    }, []);

    const authValue = {
        user,
        token,
        loading: authLoading,
        login,
        register,
        logout,
    };

    const appValue = {
        state,
        dispatch,
        placeOrder,
        loadVendorMenu,
    };

    return (
        <AuthContext.Provider value={authValue}>
            <AppContext.Provider value={appValue}>
                {children}
            </AppContext.Provider>
        </AuthContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
