import { useState, useEffect } from 'react';
import axios from '../lib/axios';

export function useCustomers(filters = {}) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams(filters).toString();
            const { data } = await axios.get(`/users?${params}`);
            setCustomers(data.usuarios || []);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al cargar clientes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [JSON.stringify(filters)]);

    return {
        customers,
        loading,
        error,
        fetchCustomers,
    };
}