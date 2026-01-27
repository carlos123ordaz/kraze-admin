'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Box, Alert } from '@mui/material';
import PageHeader from '../../../../components/common/PageHeader';
import CustomerDetails from '../../../../components/customers/CustomerDetails';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import axios from '../../../../lib/axios';

export default function CustomerDetailPage() {
    const params = useParams();
    const customerId = params.id;

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (customerId) {
            fetchCustomer();
        }
    }, [customerId]);

    const fetchCustomer = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/users/${customerId}`);
            setCustomer(data.usuario);
        } catch (error) {
            console.error('Error al cargar cliente:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!customer) {
        return (
            <Box>
                <Alert severity="error">Cliente no encontrado</Alert>
            </Box>
        );
    }

    return (
        <Box>
            <PageHeader
                title={`${customer.nombres} ${customer.apellidos}`}
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Clientes', href: '/customers' },
                    { label: customer.nombres, href: `/customers/${customerId}` },
                ]}
            />

            <CustomerDetails customer={customer} />
        </Box>
    );
}