'use client';

import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Avatar,
    Menu,
    MenuItem,
    Typography,
    Divider,
    Badge,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Notifications,
    AccountCircle,
    Logout,
    Settings,
} from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const drawerWidth = 260;

export default function TopBar({ onDrawerToggle }) {
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                width: { md: `calc(100% - ${drawerWidth}px)` },
                ml: { md: `${drawerWidth}px` },
                backgroundColor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={onDrawerToggle}
                        sx={{
                            display: { md: 'none' },
                            color: 'text.primary',
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton color="inherit" sx={{ color: 'text.primary' }}>
                        <Badge badgeContent={3} color="error">
                            <Notifications />
                        </Badge>
                    </IconButton>

                    <IconButton
                        onClick={handleMenu}
                        sx={{
                            p: 0.5,
                            ml: 1,
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                bgcolor: 'primary.main',
                                fontSize: '0.875rem',
                            }}
                        >
                            {user?.nombres?.[0]}{user?.apellidos?.[0]}
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        PaperProps={{
                            sx: {
                                mt: 1.5,
                                minWidth: 200,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            }
                        }}
                    >
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                                {user?.nombres} {user?.apellidos}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {user?.email}
                            </Typography>
                        </Box>

                        <Divider />

                        <MenuItem onClick={handleClose} sx={{ gap: 1.5, py: 1 }}>
                            <AccountCircle fontSize="small" />
                            <Typography variant="body2">Mi perfil</Typography>
                        </MenuItem>

                        <MenuItem onClick={handleClose} sx={{ gap: 1.5, py: 1 }}>
                            <Settings fontSize="small" />
                            <Typography variant="body2">Configuración</Typography>
                        </MenuItem>

                        <Divider />

                        <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1, color: 'error.main' }}>
                            <Logout fontSize="small" />
                            <Typography variant="body2">Cerrar sesión</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}