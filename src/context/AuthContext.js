'use client';

import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../lib/axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const { data } = await axios.get('/auth/perfil');
                if (data.usuario.role === 'administrador' || data.usuario.role === 'vendedor') {
                    setUser(data.usuario);
                } else {
                    logout();
                }
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/auth/login', { email, password });

            if (data.usuario.role !== 'administrador' && data.usuario.role !== 'vendedor') {
                throw new Error('No tienes permisos para acceder al panel de administración');
            }

            localStorage.setItem('token', data.token);
            setUser(data.usuario);
            router.push('/');
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.mensaje || error.message || 'Error al iniciar sesión',
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}