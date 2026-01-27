'use client';

import { Box, Typography, Button, Paper } from '@mui/material';

export default function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    onAction,
}) {
    return (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
            {icon && (
                <Box sx={{ mb: 3, color: 'text.secondary' }}>
                    {icon}
                </Box>
            )}

            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>

            {description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {description}
                </Typography>
            )}

            {actionLabel && onAction && (
                <Button variant="contained" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </Paper>
    );
}