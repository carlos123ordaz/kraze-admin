'use client';

import {
    Card,
    CardContent,
    Grid,
    Typography,
    Box,
    Avatar,
    Chip,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';
import { Person, Email, Phone, LocationOn, ShoppingCart } from '@mui/icons-material';
import { formatCurrency, formatDateTime, getInitials } from '../../lib/utils';

export default function CustomerDetails({ customer }) {
    // Función auxiliar para obtener el total de una orden de forma segura
    const getOrdenTotal = (orden) => {
        if (!orden) return 0;
        if (orden.totales && typeof orden.totales.total === 'number') {
            return orden.totales.total;
        }
        if (typeof orden.total === 'number') {
            return orden.total;
        }
        return 0;
    };

    // Función auxiliar para obtener el estado de una orden
    const getOrdenEstado = (orden) => {
        if (!orden) return 'desconocido';
        return orden.estado || 'pendiente';
    };

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
                <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                bgcolor: 'primary.main',
                                fontSize: '2rem',
                                margin: '0 auto',
                                mb: 2,
                            }}
                        >
                            {getInitials(`${customer.nombres} ${customer.apellidos}`)}
                        </Avatar>

                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            {customer.nombres} {customer.apellidos}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {customer.email}
                        </Typography>

                        <Chip
                            label={customer.activo ? 'Activo' : 'Inactivo'}
                            size="small"
                            color={customer.activo ? 'success' : 'default'}
                            sx={{ mt: 1 }}
                        />

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ textAlign: 'left' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Email fontSize="small" color="action" />
                                <Typography variant="body2">{customer.email}</Typography>
                            </Box>

                            {customer.telefono && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Phone fontSize="small" color="action" />
                                    <Typography variant="body2">{customer.telefono}</Typography>
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Person fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    Cliente desde {formatDateTime(customer.createdAt)}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{ mt: 3 }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Estadísticas
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Total de órdenes
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {customer.estadisticas?.ordenes || 0}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Total gastado
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {formatCurrency(customer.estadisticas?.totalGastado || 0)}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                                Promedio por orden
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {formatCurrency(customer.estadisticas?.promedioOrden || 0)}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Direcciones de Envío
                        </Typography>

                        {!customer.direcciones || customer.direcciones.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                                No hay direcciones registradas
                            </Typography>
                        ) : (
                            <List>
                                {customer.direcciones.map((direccion, index) => (
                                    <Box key={direccion._id || index}>
                                        {index > 0 && <Divider />}
                                        <ListItem>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                        <LocationOn fontSize="small" color="primary" />
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {direccion.alias || direccion.label || `Dirección ${index + 1}`}
                                                        </Typography>
                                                        {direccion.isDefault && (
                                                            <Chip label="Por defecto" size="small" color="primary" />
                                                        )}
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography variant="body2">
                                                            {direccion.direccion}
                                                        </Typography>
                                                        {direccion.referencia && (
                                                            <Typography variant="caption" color="text.secondary" display="block">
                                                                Ref: {direccion.referencia}
                                                            </Typography>
                                                        )}
                                                        <Typography variant="body2">
                                                            {direccion.distrito}, {direccion.provincia}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {direccion.departamento}
                                                        </Typography>
                                                        {direccion.codigoPostal && (
                                                            <Typography variant="caption" color="text.secondary" display="block">
                                                                CP: {direccion.codigoPostal}
                                                            </Typography>
                                                        )}
                                                        {direccion.telefono && (
                                                            <Typography variant="caption" color="text.secondary" display="block">
                                                                Tel: {direccion.telefono}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    </Box>
                                ))}
                            </List>
                        )}
                    </CardContent>
                </Card>

                <Card sx={{ mt: 3 }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Órdenes Recientes
                        </Typography>

                        {!customer.ordenesRecientes || customer.ordenesRecientes.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                                No hay órdenes registradas
                            </Typography>
                        ) : (
                            <List>
                                {customer.ordenesRecientes.map((orden, index) => {
                                    if (!orden) return null;
                                    
                                    return (
                                        <Box key={orden._id || index}>
                                            {index > 0 && <Divider />}
                                            <ListItem>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="body2" fontWeight={600} color="primary.main">
                                                                {orden.numeroOrden || `Orden #${index + 1}`}
                                                            </Typography>
                                                            <Chip
                                                                label={getOrdenEstado(orden)}
                                                                size="small"
                                                                color={
                                                                    getOrdenEstado(orden) === 'entregado' ? 'success' :
                                                                    getOrdenEstado(orden) === 'cancelado' ? 'error' :
                                                                    getOrdenEstado(orden) === 'enviado' ? 'info' :
                                                                    'primary'
                                                                }
                                                            />
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {orden.createdAt ? formatDateTime(orden.createdAt) : 'Fecha no disponible'}
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {formatCurrency(getOrdenTotal(orden))}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        </Box>
                                    );
                                })}
                            </List>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}