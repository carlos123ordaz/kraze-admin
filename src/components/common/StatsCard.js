'use client';

import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

export default function StatsCard({
    title,
    value,
    icon,
    trend,
    trendValue,
    color = 'primary',
}) {
    const isPositive = trend === 'up';

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight={600}>
                            {value}
                        </Typography>
                    </Box>
                    <Avatar
                        sx={{
                            bgcolor: `${color}.light`,
                            color: `${color}.main`,
                            width: 48,
                            height: 48,
                        }}
                    >
                        {icon}
                    </Avatar>
                </Box>

                {trendValue && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {isPositive ? (
                            <TrendingUp fontSize="small" color="success" />
                        ) : (
                            <TrendingDown fontSize="small" color="error" />
                        )}
                        <Typography
                            variant="body2"
                            color={isPositive ? 'success.main' : 'error.main'}
                            fontWeight={500}
                        >
                            {trendValue}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            vs mes anterior
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}