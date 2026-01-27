'use client';

import { useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';
import {
    ShoppingCart,
    People,
    Inventory2,
    TrendingUp,
} from '@mui/icons-material';
import PageHeader from '../../../components/common/PageHeader';
import StatsCard from '../../../components/common/StatsCard';
import SalesChart from '../../../components/charts/SalesChart';
import RecentOrders from '../../../components/dashboard/RecentOrders';
import LowStockProducts from '../../../components/dashboard/LowStockProducts';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import axios from '../../../lib/axios';
import { formatCurrency } from '../../../lib/utils';

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const { data } = await axios.get('/admin/dashboard');
            setDashboardData(data.dashboard);
        } catch (error) {
            console.error('Error al cargar dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    const stats = [
        {
            title: 'Ventas del Mes',
            value: formatCurrency(dashboardData?.estadisticasMes?.ventasTotales || 0),
            icon: <TrendingUp />,
            color: 'primary',
            trend: 'up',
            trendValue: '+12.5%',
        },
        {
            title: 'Órdenes',
            value: dashboardData?.resumen?.ordenesTotales || 0,
            icon: <ShoppingCart />,
            color: 'info',
            trend: 'up',
            trendValue: '+8.2%',
        },
        {
            title: 'Clientes',
            value: dashboardData?.resumen?.usuariosTotales || 0,
            icon: <People />,
            color: 'success',
            trend: 'up',
            trendValue: '+15.3%',
        },
        {
            title: 'Productos',
            value: dashboardData?.resumen?.productosActivos || 0,
            icon: <Inventory2 />,
            color: 'warning',
        },
    ];

    const salesData = dashboardData?.ventasPorDia?.map(item => ({
        fecha: new Date(item._id).toLocaleDateString('es-PE', { month: 'short', day: 'numeric' }),
        total: item.total,
    })) || [];

    return (
        <Box>
            <PageHeader title="Dashboard" />

            <Grid container spacing={3}>
                {stats.map((stat, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <StatsCard {...stat} />
                    </Grid>
                ))}

                <Grid size={{ xs: 12, lg: 8 }}>
                    <SalesChart data={salesData} title="Ventas de los últimos 30 días" type="area" />
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <LowStockProducts products={dashboardData?.productosBajoStock || []} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <RecentOrders orders={dashboardData?.ordenesRecientes || []} />
                </Grid>
            </Grid>
        </Box>
    );
}