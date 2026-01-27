'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemText,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, LocalOffer } from '@mui/icons-material';
import PageHeader from '../../../components/common/PageHeader';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { formatCurrency, formatDate } from '../../../lib/utils';
import axios from '../../../lib/axios';

export default function CouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialog, setDialog] = useState({ open: false, data: null });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/coupons');
            setCoupons(data.cupones || []);
        } catch (error) {
            console.error('Error al cargar cupones:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (coupon = null) => {
        setDialog({
            open: true,
            data: coupon || {
                codigo: '',
                tipo: 'porcentaje',
                valor: 0,
                minimoCompra: 0,
                usoMaximo: null,
                fechaInicio: '',
                fechaFin: '',
                activo: true,
            },
        });
    };

    const handleCloseDialog = () => {
        setDialog({ open: false, data: null });
    };

    const handleSave = async () => {
        try {
            if (dialog.data._id) {
                await axios.put(`/coupons/${dialog.data._id}`, dialog.data);
            } else {
                await axios.post('/coupons', dialog.data);
            }
            fetchCoupons();
            handleCloseDialog();
        } catch (error) {
            console.error('Error al guardar cupón:', error);
            alert('Error al guardar cupón');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/coupons/${deleteDialog.id}`);
            fetchCoupons();
            setDeleteDialog({ open: false, id: null });
        } catch (error) {
            console.error('Error al eliminar cupón:', error);
            alert('Error al eliminar cupón');
        }
    };

    const handleChange = (field) => (event) => {
        setDialog({
            ...dialog,
            data: { ...dialog.data, [field]: event.target.value },
        });
    };

    const isExpired = (coupon) => {
        if (!coupon.fechaFin) return false;
        return new Date(coupon.fechaFin) < new Date();
    };

    return (
        <Box>
            <PageHeader
                title="Cupones"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Cupones', href: '/coupons' },
                ]}
                actionLabel="Nuevo cupón"
                actionIcon={<Add />}
                onAction={() => handleOpenDialog()}
            />

            <Card>
                <CardContent>
                    {loading ? (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                            Cargando...
                        </Typography>
                    ) : coupons.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                            No hay cupones creados
                        </Typography>
                    ) : (
                        <List>
                            {coupons.map((coupon, index) => (
                                <ListItem
                                    key={coupon._id}
                                    secondaryAction={
                                        <Box>
                                            <IconButton onClick={() => handleOpenDialog(coupon)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton onClick={() => setDeleteDialog({ open: true, id: coupon._id })}>
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    }
                                    sx={{
                                        borderBottom: index < coupons.length - 1 ? '1px solid' : 'none',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                <LocalOffer fontSize="small" color="primary" />
                                                <Typography variant="body1" fontWeight={600}>
                                                    {coupon.codigo}
                                                </Typography>
                                                {!coupon.activo && (
                                                    <Chip label="Inactivo" size="small" />
                                                )}
                                                {isExpired(coupon) && (
                                                    <Chip label="Expirado" size="small" color="error" />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    {coupon.tipo === 'porcentaje'
                                                        ? `${coupon.valor}% de descuento`
                                                        : `${formatCurrency(coupon.valor)} de descuento`
                                                    }
                                                </Typography>
                                                {coupon.minimoCompra > 0 && (
                                                    <Typography variant="caption" display="block" color="text.secondary">
                                                        Compra mínima: {formatCurrency(coupon.minimoCompra)}
                                                    </Typography>
                                                )}
                                                {coupon.fechaFin && (
                                                    <Typography variant="caption" display="block" color="text.secondary">
                                                        Válido hasta: {formatDate(coupon.fechaFin)}
                                                    </Typography>
                                                )}
                                                <Typography variant="caption" display="block" color="text.secondary">
                                                    Usos: {coupon.usoActual || 0} {coupon.usoMaximo ? `/ ${coupon.usoMaximo}` : ''}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>

            <Dialog open={dialog.open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {dialog.data?._id ? 'Editar Cupón' : 'Nuevo Cupón'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Código"
                                value={dialog.data?.codigo || ''}
                                onChange={handleChange('codigo')}
                                required
                                inputProps={{ style: { textTransform: 'uppercase' } }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Tipo</InputLabel>
                                <Select
                                    value={dialog.data?.tipo || 'porcentaje'}
                                    onChange={handleChange('tipo')}
                                    label="Tipo"
                                >
                                    <MenuItem value="porcentaje">Porcentaje</MenuItem>
                                    <MenuItem value="monto_fijo">Monto Fijo</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Valor"
                                type="number"
                                value={dialog.data?.valor || ''}
                                onChange={handleChange('valor')}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {dialog.data?.tipo === 'porcentaje' ? '%' : 'S/'}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Compra mínima"
                                type="number"
                                value={dialog.data?.minimoCompra || ''}
                                onChange={handleChange('minimoCompra')}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">S/</InputAdornment>,
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Uso máximo"
                                type="number"
                                value={dialog.data?.usoMaximo || ''}
                                onChange={handleChange('usoMaximo')}
                                placeholder="Ilimitado"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Fecha inicio"
                                type="date"
                                value={dialog.data?.fechaInicio?.split('T')[0] || ''}
                                onChange={handleChange('fechaInicio')}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Fecha fin"
                                type="date"
                                value={dialog.data?.fechaFin?.split('T')[0] || ''}
                                onChange={handleChange('fechaFin')}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, id: null })}
                onConfirm={handleDelete}
                title="Eliminar cupón"
                message="¿Estás seguro de que deseas eliminar este cupón?"
                confirmText="Eliminar"
                severity="error"
            />
        </Box>
    );
}