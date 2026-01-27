'use client';

import { Box, CircularProgress } from '@mui/material';

export default function LoadingSpinner({ fullScreen = false }) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: fullScreen ? '100vh' : '200px',
            }}
        >
            <CircularProgress />
        </Box>
    );
}