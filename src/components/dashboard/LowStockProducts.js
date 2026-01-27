'use client';

import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Button,
    Chip,
} from '@mui/material';
import { Inventory, ArrowForward, Warning } from '@mui/icons-material';
import Link from 'next/link';

export default function LowStockProducts({ products = [] }) {
    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                        Stock Bajo
                    </Typography>
                    <Button
                        component={Link}
                        href="/products"
                        endIcon={<ArrowForward />}
                        size="small"
                    >
                        Ver productos
                    </Button>
                </Box>

                {products.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                        Todos los productos tienen stock suficiente
                    </Typography>
                ) : (
                    <List sx={{ p: 0 }}>
                        {products.map((product, index) => (
                            <ListItem
                                key={product._id}
                                component={Link}
                                href={`/products/${product._id}`}
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
                                    <Avatar
                                        src={product.imagenesPrincipales?.[0]?.url}
                                        variant="rounded"
                                        sx={{ width: 48, height: 48 }}
                                    >
                                        <Inventory />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="body2" fontWeight={600}>
                                            {product.nombre}
                                        </Typography>
                                    }
                                    secondary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                            <Warning sx={{ fontSize: 16, color: 'warning.main' }} />
                                            <Typography variant="caption" color="warning.main" fontWeight={500}>
                                                Stock: {product.stockTotal} unidades
                                            </Typography>
                                        </Box>
                                    }
                                />
                                <Chip
                                    label={product.estado}
                                    size="small"
                                    color={product.stockTotal === 0 ? 'error' : 'warning'}
                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
}