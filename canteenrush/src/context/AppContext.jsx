import React, { createContext, useContext, useState, useEffect, useReducer, useCallback } from 'react';
import api from '../api/axios';
import { connectSocket, disconnectSocket } from '../api/socket';

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

export function AppProvider({ children }) {
    // App state
    const [state, dispatch] = useReducer(reducer, initialState);

    // ─── Data Synchronization ────────────────────────────────
    useEffect(() => {
        api.get('/vendors/all')
            .then(res => dispatch({ type: 'SET_VENDORS', payload: res.data.vendors }))
            .catch(console.error);
    }, []);

    // ─── Service Protocols ──────────────────────────────────
    const placeOrder = useCallback(async (vendorId, items) => {
        const { data } = await api.post('/orders', { vendorId, items });
        dispatch({ type: 'CLEAR_CART' });
        return data.order;
    }, []);

    const loadVendorMenu = useCallback(async (vendorId) => {
        const { data } = await api.get(`/menu/vendor/${vendorId}`);
        dispatch({ type: 'SET_MENU_ITEMS', payload: data.items });
        return data.items;
    }, []);

    const appValue = {
        state,
        dispatch,
        placeOrder,
        loadVendorMenu,
    };

    return (
        <AppContext.Provider value={appValue}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
}