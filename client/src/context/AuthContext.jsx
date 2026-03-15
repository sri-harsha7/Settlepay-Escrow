import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data.data);
                } catch (error) {
                    console.error("Auth fetch error:", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        if (res.data.success) {
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return res.data;
        }
    };

    const signup = async (userData) => {
        const res = await api.post('/auth/signup', userData);
        if (res.data.success) {
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return res.data;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center" style={{ height: '100vh', backgroundColor: 'var(--bg-color)' }}>
                <div style={{ color: 'var(--text-secondary)' }}>Loading Settlepay...</div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
