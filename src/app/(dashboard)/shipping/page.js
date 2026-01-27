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
    InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, LocalShipping } from '@mui/icons-material';
import PageHeader from '../../../components/common/PageHeader';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { formatCurrency } from '../../../lib/utils';
import axios from '../../../lib/axios';

export default function ShippingPage() {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialog, setDialog] = useState({ open: false, data: null });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

    useEffect(() => {
        fetchZones();
    }, []);

    const fetchZones = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/shipping-zones');
            setZones(data.zonasEnvio || []);
        } catch (error) {
            console.error('Error al cargar zonas de envío:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (zone = null) => {
        setDialog({
            open: true,
            data: zone || {
                nombre: '',
                departamentos: [],
                costoEnvio: 0,
                tiempoEstimado: '',
                activo: true,
            },
        });
    };

    const handleCloseDialog = () => {
        setDialog({ open: false, data: null });
    };

    const handleSave = async () => {
        try {
            const dataToSend = {
                ...dialog.data,
                departamentos: dialog.data.departamentos.split(',').map(d => d.trim()).filter(Boolean),
            };

            if (dialog.data._id) {
                await axios.put(`/shipping-zones/${dialog.data._id}`, dataToSend);
            } else {
                await axios.post('/shipping-zones', dataToSend);
            }
            fetchZones();
            handleCloseDialog();
        } catch (error) {
            console.error('Error al guardar zona:', error);
            alert('Error al guardar zona de envío');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/shipping-zones/${deleteDialog.id}`);
            fetchZones();
            setDeleteDialog({ open: false, id: null });
        } catch (error) {
            console.error('Error al eliminar zona:', error);
            alert('Error al eliminar zona de envío');
        }
    };

    const handleChange = (field) => (event) => {
        setDialog({
            ...dialog,
            data: { ...dialog.data, [field]: event.target.value },
        });
    };

    return (
        <Box>
            <PageHeader
                title="Zonas de Envío"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Envíos', href: '/shipping' },
                ]}
                actionLabel="Nueva zona"
                actionIcon={<Add />}
                onAction={() => handleOpenDialog()}
            />

            <Card>
                <CardContent>
                    {loading ? (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                            Cargando...
                        </Typography>
                    ) : zones.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                            No hay zonas de envío configuradas
                        </Typography>
                    ) : (
                        <List>
                            {zones.map((zone, index) => (
                                <ListItem
                                    key={zone._id}
                                    secondaryAction={
                                        <Box>
                                            <IconButton onClick={() => handleOpenDialog({
                                                ...zone,
                                                departamentos: zone.departamentos?.join(', ') || '',
                                            })}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton onClick={() => setDeleteDialog({ open: true, id: zone._id })}>
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    }
                                    sx={{
                                        borderBottom: index < zones.length - 1 ? '1px solid' : 'none',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                <LocalShipping fontSize="small" color="primary" />
                                                <Typography variant="body1" fontWeight={600}>
                                                    {zone.nombre}
                                                </Typography>
                                                {!zone.activo && (
                                                    <Chip label="Inactivo" size="small" />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" color="primary.main" fontWeight={500}>
                                                    Costo: {zone.costoEnvio === 0 ? 'Gratis' : formatCurrency(zone.costoEnvio)}
                                                </Typography>
                                                <Typography variant="caption" display="block" color="text.secondary">
                                                    Tiempo estimado: {zone.tiempoEstimado}
                                                </Typography>
                                                <Typography variant="caption" display="block" color="text.secondary">
                                                    Departamentos: {zone.departamentos?.join(', ') || 'Ninguno'}
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
                    {dialog.data?._id ? 'Editar Zona de Envío' : 'Nueva Zona de Envío'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Nombre de la zona"
                                value={dialog.data?.nombre || ''}
                                onChange={handleChange('nombre')}
                                required
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Departamentos"
                                value={dialog.data?.departamentos || ''}
                                onChange={handleChange('departamentos')}
                                placeholder="Lima, Callao, Arequipa"
                                helperText="Separados por comas"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Costo de envío"
                                type="number"
                                value={dialog.data?.costoEnvio || ''}
                                onChange={handleChange('costoEnvio')}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">S/</InputAdornment>,
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Tiempo estimado"
                                value={dialog.data?.tiempoEstimado || ''}
                                onChange={handleChange('tiempoEstimado')}
                                placeholder="2-3 días hábiles"
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
                title="Eliminar zona de envío"
                message="¿Estás seguro de que deseas eliminar esta zona de envío?"
                confirmText="Eliminar"
                severity="error"
            />
        </Box>
    );
}