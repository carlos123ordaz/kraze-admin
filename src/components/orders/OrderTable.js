'use client';

import { useRouter } from 'next/navigation';
import {
    Box,
    Card,
    CardContent,
    Avatar,
    Chip,
} from '@mui/material';
import { Visibility, LocalShipping } from '@mui/icons-material';
import DataTable from '../common/DataTable';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { ORDER_STATUSES, PAYMENT_METHODS } from '../../lib/constants';

export default function OrderTable({
    orders,
    loading,
    pagination,
    onPageChange,
}) {
    const router = useRouter();
    const columns = [
        {
            id: 'numeroOrden',
            label: 'Orden',
            render: (row) => (
                <Box sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {row.numeroOrden}
                </Box>
            ),
        },
        {
            id: 'cliente',
            label: 'Cliente',
            render: (row) => (
                <Box>
                    <Box sx={{ fontWeight: 500, mb: 0.5 }}>
                        {row.datosEnvio.nombres} {row.datosEnvio.apellidos}
                    </Box>
                    <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        {row.datosEnvio.email}
                    </Box>
                </Box>
            ),
        },
        {
            id: 'fecha',
            label: 'Fecha',
            render: (row) => formatDateTime(row.createdAt),
        },
        {
            id: 'metodoPago',
            label: 'Método de Pago',
            render: (row) => (
                <Chip
                    label={PAYMENT_METHODS[row.metodoPago.tipo] || row.metodoPago.tipo}
                    size="small"
                    variant="outlined"
                />
            ),
        },
        {
            id: 'total',
            label: 'Total',
            align: 'right',
            render: (row) => (
                <Box sx={{ fontWeight: 600 }}>
                    {formatCurrency(row.totales.total)}
                </Box>
            ),
        },
        {
            id: 'estado',
            label: 'Estado',
            render: (row) => (
                <StatusBadge
                    label={ORDER_STATUSES[row.estado]?.label || row.estado}
                    color={ORDER_STATUSES[row.estado]?.color || 'default'}
                />
            ),
        },
        {
            id: 'items',
            label: 'Items',
            align: 'center',
            render: (row) => row.items.length,
        },
    ];

    const actions = [
        {
            label: 'Ver detalles',
            icon: <Visibility fontSize="small" />,
            onClick: (row) => router.push(`/orders/${row._id}`),
        },
    ];

    return (
        <Card>
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <DataTable
                    columns={columns}
                    rows={orders}
                    loading={loading}
                    page={pagination.paginaActual - 1}
                    rowsPerPage={pagination.limite || 20}
                    totalRows={pagination.total}
                    onPageChange={(e, newPage) => onPageChange(newPage + 1)}
                    actions={actions}
                    emptyMessage="No hay órdenes para mostrar"
                />
            </CardContent>
        </Card>
    );
}