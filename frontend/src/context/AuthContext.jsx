import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
    const [user, setUser] = useState(() => {
        try {
            return accessToken ? jwtDecode(accessToken) : null;
        } catch {
            return null;
        }
    });

    const login = ({ access, refresh }) => {
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        setAccessToken(access);
        setRefreshToken(refresh);
        setUser(jwtDecode(access));
    };

    const logout = () => {
        localStorage.clear();
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
    };

    const refreshAccessToken = useCallback(async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/refresh/`, {
                refresh: refreshToken,
            });
            const { access } = res.data;
            localStorage.setItem('accessToken', access);
            setAccessToken(access);
            setUser(jwtDecode(access));
            console.log('Access token refrescado automáticamente');
        } catch (err) {
            console.error('Error refrescando token:', err);
            logout();
        }
    }, [refreshToken]);

    useEffect(() => {
        if (!accessToken) return;

        const interval = setInterval(() => {
            try {
                const decoded = jwtDecode(accessToken);
                const exp = decoded.exp * 1000;
                const timeLeft = exp - Date.now();

                if (timeLeft < 60 * 1000) {
                    refreshAccessToken();
                }
            } catch {
                logout();
            }
        }, 60 * 1000); // check every minute

        return () => clearInterval(interval);
    }, [accessToken, refreshAccessToken]);

    const isLoggedIn = !!accessToken && user !== null;

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, user, setUser, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);
