// src/app/orders/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { Box, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PageHeader from '../../../components/common/PageHeader';
import SearchBar from '../../../components/common/SearchBar';
import OrderTable from '../../../components/orders/OrderTable';
import axios from '../../../lib/axios';
import { ORDER_STATUSES } from '../../../lib/constants';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false); // Agregar esto
    const [pagination, setPagination] = useState({
        paginaActual: 1,
        total: 0,
        limite: 20,
    });
    const [filters, setFilters] = useState({
        buscar: '',
        estado: '',
        metodoPago: '',
        pagina: 1,
        limite: 20,
    });

    // Asegurar que el componente esté montado
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            fetchOrders();
        }
    }, [filters, mounted]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const { data } = await axios.get(`/orders?${params}`);
            setOrders(data.ordenes || []);
            setPagination({
                paginaActual: data.paginaActual,
                total: data.total,
                limite: data.limite || 20,
            });
        } catch (error) {
            console.error('Error al cargar órdenes:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (field) => (event) => {
        setFilters({ ...filters, [field]: event.target.value, pagina: 1 });
    };

    const handleSearchChange = (event) => {
        setFilters({ ...filters, buscar: event.target.value, pagina: 1 });
    };

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, pagina: newPage });
    };

    // Mostrar skeleton mientras se monta el componente
    if (!mounted) {
        return null; // o un skeleton loader
    }

    return (
        <Box>
            <PageHeader
                title="Órdenes"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Órdenes', href: '/orders' },
                ]}
            />

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <SearchBar
                        value={filters.buscar}
                        onChange={handleSearchChange}
                        placeholder="Buscar por número de orden, cliente o email..."
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3, sm: 6 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Estado</InputLabel>
                        <Select
                            value={filters.estado}
                            onChange={handleFilterChange('estado')}
                            label="Estado"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {Object.entries(ORDER_STATUSES).map(([key, value]) => (
                                <MenuItem key={key} value={key}>
                                    {value.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 3, sm: 6 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Método de Pago</InputLabel>
                        <Select
                            value={filters.metodoPago}
                            onChange={handleFilterChange('metodoPago')}
                            label="Método de Pago"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="contra_entrega">Contra entrega</MenuItem>
                            <MenuItem value="yape">Yape</MenuItem>
                            <MenuItem value="mercado_pago">Mercado Pago</MenuItem>
                            <MenuItem value="transferencia">Transferencia</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <OrderTable
                orders={orders}
                loading={loading}
                pagination={pagination}
                onPageChange={handlePageChange}
            />
        </Box>
    );
}