'use client';

import {
    Card,
    CardContent,
    Grid,
    Typography,
    Box,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Chip,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { LocalShipping, Person, Payment, Edit } from '@mui/icons-material';
import { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency } from '../../lib/utils';
import { ORDER_STATUSES, PAYMENT_METHODS } from '../../lib/constants';

export default function OrderDetails({ order, onUpdateStatus, onConfirmPayment }) {
    const [statusDialog, setStatusDialog] = useState(false);
    const [paymentDialog, setPaymentDialog] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [comentario, setComentario] = useState('');
    const [paymentData, setPaymentData] = useState({
        transaccionId: '',
        numeroYape: '',
        comprobanteYape: '',
    });

    const handleUpdateStatus = () => {
        if (newStatus && onUpdateStatus) {
            onUpdateStatus(newStatus, comentario);
            setStatusDialog(false);
            setNewStatus('');
            setComentario('');
        }
    };

    const handleConfirmPayment = () => {
        if (onConfirmPayment) {
            onConfirmPayment(paymentData);
            setPaymentDialog(false);
        }
    };

    return (
        <>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" fontWeight={600}>
                                    Items del Pedido
                                </Typography>
                            </Box>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Producto</TableCell>
                                            <TableCell>Variante</TableCell>
                                            <TableCell align="center">Cantidad</TableCell>
                                            <TableCell align="right">Precio</TableCell>
                                            <TableCell align="right">Subtotal</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {order.items?.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar
                                                            src={item.imagen || item.producto?.imagenesPrincipales?.[0]?.url}
                                                            variant="rounded"
                                                            sx={{ width: 48, height: 48 }}
                                                        />
                                                        <Typography variant="body2" fontWeight={500}>
                                                            {item.nombre || 'Producto eliminado'}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2">
                                                            {item.talla}
                                                        </Typography>
                                                        {item.color && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                                                <Box
                                                                    sx={{
                                                                        width: 12,
                                                                        height: 12,
                                                                        borderRadius: 1,
                                                                        backgroundColor: item.color.codigoHex,
                                                                        border: '1px solid',
                                                                        borderColor: 'divider',
                                                                    }}
                                                                />
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {item.color.nombre}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">{item.cantidad}</TableCell>
                                                <TableCell align="right">{formatCurrency(item.precioUnitario)}</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600 }}>
                                                    {formatCurrency(item.precioTotal)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                <Box sx={{ minWidth: 300 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">Subtotal</Typography>
                                        <Typography variant="body2">
                                            {formatCurrency(order.montos?.subtotal || 0)}
                                        </Typography>
                                    </Box>

                                    {order.montos?.descuentos > 0 && (
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" color="success.main">
                                                Descuentos
                                            </Typography>
                                            <Typography variant="body2" color="success.main">
                                                -{formatCurrency(order.montos.descuentos)}
                                            </Typography>
                                        </Box>
                                    )}

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">Envío</Typography>
                                        <Typography variant="body2">
                                            {order.montos?.costoEnvio === 0
                                                ? 'Gratis'
                                                : formatCurrency(order.montos?.costoEnvio || 0)
                                            }
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 1 }} />

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="h6" fontWeight={600}>
                                            Total
                                        </Typography>
                                        <Typography variant="h6" fontWeight={600}>
                                            {formatCurrency(order.montos?.total || 0)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Notas del Cliente
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {order.notasCliente || 'Sin notas'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" fontWeight={600}>
                                    Estado
                                </Typography>
                                <Button
                                    size="small"
                                    startIcon={<Edit />}
                                    onClick={() => setStatusDialog(true)}
                                >
                                    Cambiar
                                </Button>
                            </Box>

                            <StatusBadge
                                label={ORDER_STATUSES[order.estado]?.label || order.estado}
                                color={ORDER_STATUSES[order.estado]?.color || 'default'}
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Person color="primary" />
                                <Typography variant="h6" fontWeight={600}>
                                    Cliente
                                </Typography>
                            </Box>

                            <Typography variant="body2" fontWeight={500}>
                                {order.cliente?.nombres} {order.cliente?.apellidos}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {order.cliente?.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {order.cliente?.telefono}
                            </Typography>
                            {order.cliente?.dni && (
                                <Typography variant="body2" color="text.secondary">
                                    DNI: {order.cliente.dni}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <LocalShipping color="primary" />
                                <Typography variant="h6" fontWeight={600}>
                                    Dirección de Envío
                                </Typography>
                            </Box>

                            <Typography variant="body2">
                                {order.direccionEnvio?.direccion}
                            </Typography>
                            {order.direccionEnvio?.referencia && (
                                <Typography variant="body2" color="text.secondary">
                                    Ref: {order.direccionEnvio.referencia}
                                </Typography>
                            )}
                            <Typography variant="body2">
                                {order.direccionEnvio?.distrito}, {order.direccionEnvio?.provincia}
                            </Typography>
                            <Typography variant="body2">
                                {order.direccionEnvio?.departamento}
                            </Typography>
                            {order.direccionEnvio?.codigoPostal && (
                                <Typography variant="body2" color="text.secondary">
                                    CP: {order.direccionEnvio.codigoPostal}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Payment color="primary" />
                                    <Typography variant="h6" fontWeight={600}>
                                        Pago
                                    </Typography>
                                </Box>
                                {order.metodoPago?.estado === 'pendiente' && (
                                    <Button
                                        size="small"
                                        onClick={() => setPaymentDialog(true)}
                                    >
                                        Confirmar
                                    </Button>
                                )}
                            </Box>

                            <Box sx={{ mb: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Método
                                </Typography>
                                <Typography variant="body2">
                                    {PAYMENT_METHODS[order.metodoPago?.tipo] || order.metodoPago?.tipo}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Estado
                                </Typography>
                                <Box sx={{ mt: 0.5 }}>
                                    <Chip
                                        label={order.metodoPago?.estado || 'pendiente'}
                                        size="small"
                                        color={order.metodoPago?.estado === 'pagado' ? 'success' : 'warning'}
                                    />
                                </Box>
                            </Box>

                            {order.metodoPago?.fechaPago && (
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Fecha de Pago
                                    </Typography>
                                    <Typography variant="body2">
                                        {new Date(order.metodoPago.fechaPago).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Dialog para cambiar estado */}
            <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Actualizar Estado de Orden</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                        <InputLabel>Nuevo Estado</InputLabel>
                        <Select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            label="Nuevo Estado"
                        >
                            {Object.entries(ORDER_STATUSES).map(([key, value]) => (
                                <MenuItem key={key} value={key}>
                                    {value.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Comentario (opcional)"
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStatusDialog(false)}>Cancelar</Button>
                    <Button onClick={handleUpdateStatus} variant="contained">
                        Actualizar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog para confirmar pago */}
            <Dialog open={paymentDialog} onClose={() => setPaymentDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Confirmar Pago</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="ID de Transacción"
                        value={paymentData.transaccionId}
                        onChange={(e) => setPaymentData({ ...paymentData, transaccionId: e.target.value })}
                        sx={{ mt: 2, mb: 2 }}
                    />

                    {order.metodoPago?.tipo === 'yape' && (
                        <>
                            <TextField
                                fullWidth
                                label="Número Yape"
                                value={paymentData.numeroYape}
                                onChange={(e) => setPaymentData({ ...paymentData, numeroYape: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="URL Comprobante Yape"
                                value={paymentData.comprobanteYape}
                                onChange={(e) => setPaymentData({ ...paymentData, comprobanteYape: e.target.value })}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPaymentDialog(false)}>Cancelar</Button>
                    <Button onClick={handleConfirmPayment} variant="contained" color="success">
                        Confirmar Pago
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}