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
} from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import { formatCurrency } from '../../lib/utils';

export default function TopProducts({ products = [] }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Productos Más Vendidos
                </Typography>

                {products.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                        No hay datos disponibles
                    </Typography>
                ) : (
                    <List sx={{ p: 0 }}>
                        {products.map((product, index) => (
                            <ListItem
                                key={product._id}
                                sx={{
                                    px: 0,
                                    py: 1.5,
                                    borderTop: index > 0 ? '1px solid' : 'none',
                                    borderColor: 'divider',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 1,
                                        backgroundColor: index < 3 ? 'primary.light' : 'grey.200',
                                        color: index < 3 ? 'primary.main' : 'text.secondary',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        mr: 2,
                                    }}
                                >
                                    {index + 1}
                                </Box>
                                <ListItemAvatar>
                                    <Avatar
                                        src={product.imagenesPrincipales?.[0]?.url}
                                        variant="rounded"
                                        sx={{ width: 40, height: 40 }}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="body2" fontWeight={500}>
                                            {product.nombre}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="caption" color="text.secondary">
                                            {product.totalVendido} vendidos
                                        </Typography>
                                    }
                                />
                                <Typography variant="body2" fontWeight={600} color="primary.main">
                                    {formatCurrency(product.ingresos)}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
}