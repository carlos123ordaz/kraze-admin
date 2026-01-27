import { useState, useEffect } from 'react';
import axios from '../lib/axios';

export function useProducts(filters = {}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        total: 0,
        paginas: 0,
        paginaActual: 1,
    });

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams(filters).toString();
            const { data } = await axios.get(`/products?${params}`);
            setProducts(data.productos);
            setPagination({
                total: data.total,
                paginas: data.paginas,
                paginaActual: data.paginaActual,
            });
            setError(null);
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [JSON.stringify(filters)]);

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`/products/${id}`);
            fetchProducts();
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.mensaje || 'Error al eliminar producto',
            };
        }
    };

    return {
        products,
        loading,
        error,
        pagination,
        fetchProducts,
        deleteProduct,
    };
}