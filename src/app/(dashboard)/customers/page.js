'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
} from '@mui/material';
import { People } from '@mui/icons-material';
import PageHeader from '../../../components/common/PageHeader';
import SearchBar from '../../../components/common/SearchBar';
import CustomerTable from '../../../components/customers/CustomerTable';
import StatsCard from '../../../components/common/StatsCard';
import axios from '../../../lib/axios';

export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        nuevos: 0,
        activos: 0,
    });
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        paginaActual: 1,
        total: 0,
        limite: 20,
    });
    const [filters, setFilters] = useState({
        buscar: '',
        pagina: 1,
        limite: 20,
    });

    useEffect(() => {
        fetchCustomers();
    }, [filters]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const { data } = await axios.get(`/users?rol=cliente&${params}`);
            setCustomers(data.usuarios);
            setPagination({
                paginaActual: data.paginaActual,
                total: data.total,
                limite: data.limite || 20,
            });

            // Calcular estadísticas básicas
            setStats({
                total: data.total,
                nuevos: data.usuarios.filter(u => {
                    const diffDays = (Date.now() - new Date(u.createdAt)) / (1000 * 60 * 60 * 24);
                    return diffDays <= 30;
                }).length,
                activos: data.usuarios.filter(u => u.activo).length,
            });
        } catch (error) {
            console.error('Error al cargar clientes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        setFilters({ ...filters, buscar: event.target.value, pagina: 1 });
    };

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, pagina: newPage });
    };

    return (
        <Box>
            <PageHeader
                title="Clientes"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Clientes', href: '/customers' },
                ]}
            />

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <StatsCard
                        title="Total Clientes"
                        value={stats.total}
                        icon={<People />}
                        color="primary"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <StatsCard
                        title="Nuevos (30 días)"
                        value={stats.nuevos}
                        icon={<People />}
                        color="success"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <StatsCard
                        title="Activos"
                        value={stats.activos}
                        icon={<People />}
                        color="info"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <SearchBar
                        value={filters.buscar}
                        onChange={handleSearchChange}
                        placeholder="Buscar clientes por nombre o email..."
                    />
                </Grid>
            </Grid>

            <Card>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                    <CustomerTable
                        customers={customers}
                        loading={loading}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                    />
                </CardContent>
            </Card>
        </Box>
    );
}