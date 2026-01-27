'use client';

import { Box, Typography, Breadcrumbs, Link as MuiLink, Button } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import Link from 'next/link';

export default function PageHeader({
    title,
    breadcrumbs = [],
    action,
    actionLabel,
    onAction,
    actionIcon,
}) {
    return (
        <Box sx={{ mb: 3 }}>
            {breadcrumbs.length > 0 && (
                <Breadcrumbs
                    separator={<NavigateNext fontSize="small" />}
                    sx={{ mb: 1 }}
                >
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;

                        return isLast ? (
                            <Typography key={crumb.label} color="text.primary" fontSize="0.875rem">
                                {crumb.label}
                            </Typography>
                        ) : (
                            <MuiLink
                                key={crumb.label}
                                component={Link}
                                href={crumb.href}
                                color="inherit"
                                underline="hover"
                                fontSize="0.875rem"
                            >
                                {crumb.label}
                            </MuiLink>
                        );
                    })}
                </Breadcrumbs>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" fontWeight={600}>
                    {title}
                </Typography>

                {(action || actionLabel) && (
                    <Button
                        variant="contained"
                        startIcon={actionIcon}
                        onClick={onAction}
                        sx={{ minWidth: 120 }}
                    >
                        {actionLabel || 'Acción'}
                    </Button>
                )}
            </Box>
        </Box>
    );
}