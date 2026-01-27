'use client';

import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent,
} from '@mui/lab';
import { Box, Typography, Card, CardContent } from '@mui/material';
import {
    CheckCircle,
    Schedule,
    LocalShipping,
    Cancel,
    Payment,
} from '@mui/icons-material';
import { formatDateTime } from '../../lib/utils';
import { ORDER_STATUSES } from '../../lib/constants';

const getIconByStatus = (estado) => {
    const icons = {
        pendiente_pago: <Schedule />,
        confirmado: <CheckCircle />,
        procesando: <Schedule />,
        enviado: <LocalShipping />,
        en_transito: <LocalShipping />,
        en_reparto: <LocalShipping />,
        entregado: <CheckCircle />,
        cancelado: <Cancel />,
    };
    return icons[estado] || <Schedule />;
};

export default function OrderTimeline({ historialEstados = [] }) {
    if (!historialEstados || historialEstados.length === 0) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        No hay historial de estados
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Historial de Estados
                </Typography>

                <Timeline position="right" sx={{ p: 0, m: 0 }}>
                    {historialEstados.map((item, index) => {
                        const isLast = index === historialEstados.length - 1;
                        const statusConfig = ORDER_STATUSES[item.estado];

                        return (
                            <TimelineItem key={index}>
                                <TimelineOppositeContent
                                    sx={{
                                        flex: 0.3,
                                        py: 2,
                                        px: 1,
                                    }}
                                >
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDateTime(item.fecha)}
                                    </Typography>
                                </TimelineOppositeContent>

                                <TimelineSeparator>
                                    <TimelineDot
                                        color={statusConfig?.color || 'grey'}
                                        sx={{
                                            boxShadow: 2,
                                            p: 1,
                                        }}
                                    >
                                        {getIconByStatus(item.estado)}
                                    </TimelineDot>
                                    {!isLast && <TimelineConnector />}
                                </TimelineSeparator>

                                <TimelineContent sx={{ py: 2, px: 2 }}>
                                    <Typography variant="body2" fontWeight={600}>
                                        {statusConfig?.label || item.estado}
                                    </Typography>
                                    {item.comentario && (
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            {item.comentario}
                                        </Typography>
                                    )}
                                </TimelineContent>
                            </TimelineItem>
                        );
                    })}
                </Timeline>
            </CardContent>
        </Card>
    );
}