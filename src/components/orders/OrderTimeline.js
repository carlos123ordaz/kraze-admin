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
    Assignment,
    Inventory,
} from '@mui/icons-material';
import { formatDateTime } from '../../lib/utils';
import { ORDER_STATUSES } from '../../lib/constants';

const getIconByStatus = (estado) => {
    const icons = {
        pendiente_pago: <Schedule />,
        confirmado: <CheckCircle />,
        procesando: <Inventory />,
        enviado: <LocalShipping />,
        en_transito: <LocalShipping />,
        en_reparto: <LocalShipping />,
        entregado: <CheckCircle />,
        cancelado: <Cancel />,
        devolucion_solicitada: <Assignment />,
        devuelto: <Cancel />,
        reembolsado: <Cancel />,
    };
    return icons[estado] || <Schedule />;
};

export default function OrderTimeline({ orden }) {
    // Construir el historial completo usando tanto historialEstados como seguimiento
    const buildTimeline = () => {
        const timeline = [];

        // Agregar estado actual si no hay historial
        if (!orden?.historialEstados || orden.historialEstados.length === 0) {
            if (orden?.estado) {
                timeline.push({
                    estado: orden.estado,
                    fecha: orden.createdAt || new Date(),
                    comentario: 'Orden creada',
                });
            }
        } else {
            // Usar el historial existente
            timeline.push(...orden.historialEstados);
        }

        // Ordenar por fecha (más reciente primero)
        return timeline.sort((a, b) => {
            const dateA = new Date(a.fecha);
            const dateB = new Date(b.fecha);
            return dateB - dateA;
        });
    };

    const timeline = buildTimeline();

    if (timeline.length === 0) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        No hay historial de estados disponible
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
                    {timeline.map((item, index) => {
                        const isLast = index === timeline.length - 1;
                        const statusConfig = ORDER_STATUSES[item.estado];

                        return (
                            <TimelineItem key={`${item.estado}-${index}`}>
                                <TimelineOppositeContent
                                    sx={{
                                        flex: 0.3,
                                        py: 2,
                                        px: 1,
                                    }}
                                >
                                    <Typography variant="caption" color="text.secondary">
                                        {item.fecha ? formatDateTime(item.fecha) : 'Fecha no disponible'}
                                    </Typography>
                                    {item.usuario && (
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            Por: Admin
                                        </Typography>
                                    )}
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
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                            sx={{ mt: 0.5 }}
                                        >
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