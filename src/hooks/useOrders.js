import { useState, useEffect } from 'react';
import axios from '../lib/axios';

export function useOrders(filters = {}) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        total: 0,
        paginas: 0,
        paginaActual: 1,
    });

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams(filters).toString();
            const { data } = await axios.get(`/orders?${params}`);
            setOrders(data.ordenes);
            setPagination({
                total: data.total,
                paginas: data.paginas,
                paginaActual: data.paginaActual,
            });
            setError(null);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al cargar órdenes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [JSON.stringify(filters)]);

    const updateOrderStatus = async (id, estado, comentario) => {
        try {
            await axios.put(`/orders/${id}/estado`, { estado, comentario });
            fetchOrders();
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.mensaje || 'Error al actualizar estado',
            };
        }
    };

    const confirmPayment = async (id, datosPago) => {
        try {
            await axios.post(`/orders/${id}/confirmar-pago`, datosPago);
            fetchOrders();
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.mensaje || 'Error al confirmar pago',
            };
        }
    };

    return {
        orders,
        loading,
        error,
        pagination,
        fetchOrders,
        updateOrderStatus,
        confirmPayment,
    };
}