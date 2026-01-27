'use client';

import { useRouter } from 'next/navigation';
import {
    Box,
    Avatar,
    Chip,
} from '@mui/material';
import { Visibility, Email, Block } from '@mui/icons-material';
import DataTable from '../common/DataTable';
import { formatDateTime, getInitials } from '../../lib/utils';

export default function CustomerTable({
    customers,
    loading,
    pagination,
    onPageChange,
}) {
    const router = useRouter();

    const columns = [
        {
            id: 'avatar',
            label: 'Cliente',
            render: (row) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {getInitials(`${row.nombres} ${row.apellidos}`)}
                    </Avatar>
                    <Box>
                        <Box sx={{ fontWeight: 600 }}>
                            {row.nombres} {row.apellidos}
                        </Box>
                        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                            {row.email}
                        </Box>
                    </Box>
                </Box>
            ),
        },
        {
            id: 'telefono',
            label: 'Teléfono',
            render: (row) => row.telefono || '-',
        },
        {
            id: 'direcciones',
            label: 'Direcciones',
            align: 'center',
            render: (row) => row.direcciones?.length || 0,
        },
        {
            id: 'ordenes',
            label: 'Órdenes',
            align: 'center',
            render: (row) => row.estadisticas?.ordenes || 0,
        },
        {
            id: 'gastado',
            label: 'Total Gastado',
            align: 'right',
            render: (row) => `S/ ${(row.estadisticas?.totalGastado || 0).toFixed(2)}`,
        },
        {
            id: 'estado',
            label: 'Estado',
            render: (row) => (
                <Chip
                    label={row.activo ? 'Activo' : 'Inactivo'}
                    size="small"
                    color={row.activo ? 'success' : 'default'}
                />
            ),
        },
        {
            id: 'createdAt',
            label: 'Registrado',
            render: (row) => formatDateTime(row.createdAt),
        },
    ];

    const actions = [
        {
            label: 'Ver perfil',
            icon: <Visibility fontSize="small" />,
            onClick: (row) => router.push(`/customers/${row._id}`),
        },
        {
            label: 'Enviar email',
            icon: <Email fontSize="small" />,
            onClick: (row) => window.location.href = `mailto:${row.email}`,
        },
    ];

    return (
        <DataTable
            columns={columns}
            rows={customers}
            loading={loading}
            page={pagination.paginaActual - 1}
            rowsPerPage={pagination.limite || 20}
            totalRows={pagination.total}
            onPageChange={(e, newPage) => onPageChange(newPage + 1)}
            actions={actions}
            emptyMessage="No hay clientes registrados"
        />
    );
}