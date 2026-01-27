'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Typography,
    Divider,
} from '@mui/material';
import {
    Dashboard,
    Inventory2,
    ShoppingCart,
    People,
    Category,
    Collections,
    RateReview,
    LocalOffer,
    LocalShipping,
    Settings,
    ExpandLess,
    ExpandMore,
    Store,
} from '@mui/icons-material';

const drawerWidth = 260;

const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Productos', icon: <Inventory2 />, path: '/products' },
    { text: 'Categorías', icon: <Category />, path: '/categories' },
    { text: 'Colecciones', icon: <Collections />, path: '/collections' },
    { text: 'Pedidos', icon: <ShoppingCart />, path: '/orders' },
    { text: 'Clientes', icon: <People />, path: '/customers' },
    { text: 'Reseñas', icon: <RateReview />, path: '/reviews' },
    { text: 'Cupones', icon: <LocalOffer />, path: '/coupons' },
    { text: 'Envíos', icon: <LocalShipping />, path: '/shipping' },
    { text: 'Configuración', icon: <Settings />, path: '/settings' },
];

export default function Sidebar({ mobileOpen, onDrawerToggle }) {
    const pathname = usePathname();

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Store sx={{ fontSize: 28, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={600} color="text.primary">
                    Kraze Store
                </Typography>
            </Box>

            <Divider />

            <List sx={{ px: 1.5, py: 1, flex: 1 }}>
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.path);

                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                component={Link}
                                href={item.path}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.25,
                                    px: 2,
                                    backgroundColor: isActive ? 'rgba(0, 128, 96, 0.08)' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: isActive ? 'rgba(0, 128, 96, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{
                                    minWidth: 40,
                                    color: isActive ? 'primary.main' : 'text.secondary',
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: '0.9375rem',
                                        fontWeight: isActive ? 600 : 500,
                                        color: isActive ? 'primary.main' : 'text.primary',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider />

            <Box sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">
                    Kraze Store Admin v1.0
                </Typography>
            </Box>
        </Box>
    );

    return (
        <>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        border: 'none',
                    },
                }}
            >
                {drawer}
            </Drawer>

            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        border: 'none',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                    },
                }}
                open
            >
                {drawer}
            </Drawer>
        </>
    );
}