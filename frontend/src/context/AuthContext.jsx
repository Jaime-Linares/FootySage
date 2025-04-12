import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';


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

    const isLoggedIn = !!accessToken && user !== null;

    useEffect(() => {
        if (!accessToken) return;

        try {
            const { exp } = jwtDecode(accessToken);
            const expiresIn = exp * 1000 - Date.now();

            if (expiresIn <= 0) {
                logout();
            } else {
                const timeout = setTimeout(() => {
                    logout();
                }, expiresIn);

                return () => clearTimeout(timeout);
            }
        } catch {
            logout();
        }
    }, [accessToken]);

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, user, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);
