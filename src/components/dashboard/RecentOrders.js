'use client';

import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Chip,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Button,
} from '@mui/material';
import { ShoppingCart, ArrowForward } from '@mui/icons-material';
import Link from 'next/link';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { ORDER_STATUSES } from '../../lib/constants';

export default function RecentOrders({ orders = [] }) {
    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                        Órdenes Recientes
                    </Typography>
                    <Button
                        component={Link}
                        href="/orders"
                        endIcon={<ArrowForward />}
                        size="small"
                    >
                        Ver todas
                    </Button>
                </Box>

                {orders.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                        No hay órdenes recientes
                    </Typography>
                ) : (
                    <List sx={{ p: 0 }}>
                        {orders.map((order, index) => (
                            <ListItem
                                key={order._id}
                                component={Link}
                                href={`/orders/${order._id}`}
                                sx={{
                                    px: 0,
                                    py: 1.5,
                                    borderTop: index > 0 ? '1px solid' : 'none',
                                    borderColor: 'divider',
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                    cursor: 'pointer',
                                    borderRadius: 1,
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                                        <ShoppingCart />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2" fontWeight={600}>
                                                {order.numeroOrden}
                                            </Typography>
                                            <Chip
                                                label={ORDER_STATUSES[order.estado]?.label || order.estado}
                                                size="small"
                                                color={ORDER_STATUSES[order.estado]?.color || 'default'}
                                                sx={{ height: 20, fontSize: '0.7rem' }}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {order.datosEnvio.nombres} {order.datosEnvio.apellidos}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                {formatDateTime(order.createdAt)}
                                            </Typography>
                                        </Box>
                                    }
                                />
                                <Typography variant="body2" fontWeight={600}>
                                    {formatCurrency(order.totales.total)}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
}