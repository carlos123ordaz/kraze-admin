'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../lib/utils';

export default function SalesChart({ data, title = 'Ventas', type = 'line' }) {
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <Box
                    sx={{
                        backgroundColor: 'background.paper',
                        p: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        boxShadow: 2,
                    }}
                >
                    <Typography variant="body2" fontWeight={600}>
                        {payload[0].payload.fecha}
                    </Typography>
                    <Typography variant="body2" color="primary.main">
                        {formatCurrency(payload[0].value)}
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    {title}
                </Typography>

                <ResponsiveContainer width="100%" height={300}>
                    {type === 'area' ? (
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#008060" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#008060" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="fecha"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                tickFormatter={(value) => `S/ ${value}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#008060"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorVentas)"
                            />
                        </AreaChart>
                    ) : (
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="fecha"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                tickFormatter={(value) => `S/ ${value}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#008060"
                                strokeWidth={2}
                                dot={{ fill: '#008060', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}