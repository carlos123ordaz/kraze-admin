'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Box, Grid, Alert, Snackbar } from '@mui/material';
import PageHeader from '../../../../components/common/PageHeader';
import OrderDetails from '../../../../components/orders/OrderDetails';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import axios from '../../../../lib/axios';
import OrderTimeline from '@/components/orders/OrderTimeline';

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = params.id;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/orders/${orderId}`);
            setOrder(data.orden);
        } catch (error) {
            console.error('Error al cargar orden:', error);
            setSnackbar({
                open: true,
                message: 'Error al cargar la orden',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (estado, comentario) => {
        try {
            await axios.put(`/orders/${orderId}/estado`, { estado, comentario });
            setSnackbar({
                open: true,
                message: 'Estado actualizado correctamente',
                severity: 'success',
            });
            fetchOrder();
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.mensaje || 'Error al actualizar estado',
                severity: 'error',
            });
        }
    };

    const handleConfirmPayment = async (paymentData) => {
        try {
            await axios.post(`/orders/${orderId}/confirmar-pago`, paymentData);
            setSnackbar({
                open: true,
                message: 'Pago confirmado correctamente',
                severity: 'success',
            });
            fetchOrder();
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.mensaje || 'Error al confirmar pago',
                severity: 'error',
            });
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!order) {
        return (
            <Box>
                <Alert severity="error">Orden no encontrada</Alert>
            </Box>
        );
    }

    return (
        <Box>
            <PageHeader
                title={`Orden ${order.numeroOrden}`}
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Órdenes', href: '/orders' },
                    { label: order.numeroOrden, href: `/orders/${orderId}` },
                ]}
            />

            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }} lg={8}>
                    <OrderDetails
                        order={order}
                        onUpdateStatus={handleUpdateStatus}
                        onConfirmPayment={handleConfirmPayment}
                    />
                </Grid>

                <Grid size={{ xs: 12 }} lg={4}>
                    <OrderTimeline orden={order} />
                </Grid>
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}