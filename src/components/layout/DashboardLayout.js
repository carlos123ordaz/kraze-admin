'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const drawerWidth = 260;

export default function DashboardLayout({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <TopBar onDrawerToggle={handleDrawerToggle} />

            <Sidebar
                mobileOpen={mobileOpen}
                onDrawerToggle={handleDrawerToggle}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` }, // Margen izquierdo para el sidebar
                    backgroundColor: 'background.default',
                    minHeight: '100vh',
                    pt: { xs: '56px', sm: '64px' }, // Altura del AppBar
                    mt: '8px', // Margen adicional para separación
                }}
            >
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}