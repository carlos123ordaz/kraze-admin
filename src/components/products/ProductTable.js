'use client';

import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    Edit,
    Delete,
    Visibility,
    MoreVert,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import DataTable from '../common/DataTable';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency } from '../../lib/utils';
import { PRODUCT_STATUSES } from '../../lib/constants';

export default function ProductTable({
    products,
    loading,
    pagination,
    onPageChange,
    onDelete
}) {
    const router = useRouter();

    const columns = [
        {
            id: 'imagen',
            label: 'Imagen',
            render: (row) => (
                <Avatar
                    src={row.imagenesPrincipales?.[0]?.url}
                    variant="rounded"
                    sx={{ width: 56, height: 56 }}
                />
            ),
        },
        {
            id: 'nombre',
            label: 'Producto',
            render: (row) => (
                <Box>
                    <Box sx={{ fontWeight: 600, mb: 0.5 }}>{row.nombre}</Box>
                    <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        SKU: {row.sku || 'N/A'}
                    </Box>
                </Box>
            ),
        },
        {
            id: 'categoria',
            label: 'Categoría',
            render: (row) => row.categoria?.nombre || 'Sin categoría',
        },
        {
            id: 'precio',
            label: 'Precio',
            render: (row) => (
                <Box>
                    <Box sx={{ fontWeight: 600 }}>{formatCurrency(row.precio)}</Box>
                    {row.descuento?.activo && (
                        <Box sx={{ fontSize: '0.75rem', color: 'success.main' }}>
                            -{row.descuento.porcentaje}%
                        </Box>
                    )}
                </Box>
            ),
        },
        {
            id: 'stock',
            label: 'Stock',
            align: 'center',
            render: (row) => (
                <Chip
                    label={row.stockTotal}
                    size="small"
                    color={row.stockTotal === 0 ? 'error' : row.stockTotal < 10 ? 'warning' : 'success'}
                />
            ),
        },
        {
            id: 'estado',
            label: 'Estado',
            render: (row) => (
                <StatusBadge
                    label={PRODUCT_STATUSES[row.estado]?.label || row.estado}
                    color={PRODUCT_STATUSES[row.estado]?.color || 'default'}
                />
            ),
        },
        {
            id: 'ventas',
            label: 'Ventas',
            align: 'center',
            render: (row) => row.estadisticas?.ventasTotales || 0,
        },
    ];

    const actions = [
        {
            label: 'Ver',
            icon: <Visibility fontSize="small" />,
            onClick: (row) => router.push(`/products/${row._id}`),
        },
        {
            label: 'Editar',
            icon: <Edit fontSize="small" />,
            onClick: (row) => router.push(`/products/${row._id}`),
        },
        {
            label: 'Eliminar',
            icon: <Delete fontSize="small" />,
            onClick: (row) => onDelete(row._id),
        },
    ];

    return (
        <Card>
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <DataTable
                    columns={columns}
                    rows={products}
                    loading={loading}
                    page={pagination.paginaActual - 1}
                    rowsPerPage={pagination.limite || 20}
                    totalRows={pagination.total}
                    onPageChange={(e, newPage) => onPageChange(newPage + 1)}
                    actions={actions}
                    emptyMessage="No hay productos para mostrar"
                />
            </CardContent>
        </Card>
    );
}