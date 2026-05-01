'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { formatCurrency } from '../../lib/utils';

const CustomTooltip = ({ active, payload, label, valueFormatter }) => {
    if (!active || !payload?.length) return null;
    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 1.5,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
        >
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                {label}
            </Typography>
            {payload.map((entry) => (
                <Typography key={entry.dataKey} variant="body2" sx={{ color: entry.color, fontWeight: 600 }}>
                    {entry.name}: {valueFormatter ? valueFormatter(entry.value) : entry.value}
                </Typography>
            ))}
        </Box>
    );
};

export default function StatsChart({
    data = [],
    title = 'Estadísticas',
    bars = [{ dataKey: 'value', name: 'Valor', color: '#00897b' }],
    xDataKey = 'name',
    formatValue,
    height = 300,
}) {
    return (
        <Card>
            <CardContent>
                {title && (
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        {title}
                    </Typography>
                )}
                <ResponsiveContainer width="100%" height={height}>
                    <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                        <XAxis
                            dataKey={xDataKey}
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={formatValue}
                        />
                        <Tooltip content={<CustomTooltip valueFormatter={formatValue} />} />
                        {bars.length > 1 && <Legend />}
                        {bars.map((bar) => (
                            <Bar
                                key={bar.dataKey}
                                dataKey={bar.dataKey}
                                name={bar.name}
                                fill={bar.color || '#00897b'}
                                radius={[4, 4, 0, 0]}
                                maxBarSize={48}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
