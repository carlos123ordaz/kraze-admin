'use client';

import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Grid,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { SIZES } from '../../lib/constants';
import axios from '../../lib/axios';

export default function VariantForm({ productId, variants = [], onVariantsUpdate }) {
    const [open, setOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingVariantId, setEditingVariantId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [variantData, setVariantData] = useState({
        talla: '',
        color: { nombre: '', codigoHex: '#000000' },
        sku: '',
        stock: 0,
        activo: true,
    });

    const handleOpen = (index = null) => {
        if (index !== null) {
            const variant = variants[index];
            setVariantData({
                talla: variant.talla,
                color: variant.color,
                sku: variant.sku,
                stock: variant.stock,
                activo: variant.activo,
            });
            setEditingIndex(index);
            setEditingVariantId(variant._id);
        } else {
            setVariantData({
                talla: '',
                color: { nombre: '', codigoHex: '#000000' },
                sku: '',
                stock: 0,
                activo: true,
            });
            setEditingIndex(null);
            setEditingVariantId(null);
        }
        setError('');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingIndex(null);
        setEditingVariantId(null);
        setError('');
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            setError('');

            if (editingVariantId) {
                // Actualizar variante existente
                const { data } = await axios.put(
                    `/products/${productId}/variantes/${editingVariantId}`,
                    variantData
                );
                if (onVariantsUpdate) {
                    onVariantsUpdate(data.producto.variantes);
                }
            } else {
                // Crear nueva variante
                const { data } = await axios.post(
                    `/products/${productId}/variantes`,
                    variantData
                );
                if (onVariantsUpdate) {
                    onVariantsUpdate(data.producto.variantes);
                }
            }
            
            handleClose();
        } catch (err) {
            console.error('Error al guardar variante:', err);
            setError(err.response?.data?.mensaje || 'Error al guardar la variante');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (index) => {
        const variant = variants[index];
        
        if (!variant._id) {
            // Si la variante no tiene ID, solo la removemos localmente
            const updated = variants.filter((_, i) => i !== index);
            if (onVariantsUpdate) {
                onVariantsUpdate(updated);
            }
            return;
        }

        if (window.confirm('¿Estás seguro de eliminar esta variante?')) {
            try {
                setLoading(true);
                setError('');
                
                const { data } = await axios.delete(
                    `/products/${productId}/variantes/${variant._id}`
                );
                
                if (onVariantsUpdate) {
                    onVariantsUpdate(data.producto.variantes);
                }
            } catch (err) {
                console.error('Error al eliminar variante:', err);
                setError(err.response?.data?.mensaje || 'Error al eliminar la variante');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleChange = (field) => (event) => {
        setVariantData({ ...variantData, [field]: event.target.value });
    };

    const handleColorChange = (field) => (event) => {
        setVariantData({
            ...variantData,
            color: { ...variantData.color, [field]: event.target.value },
        });
    };

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                        Variantes
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => handleOpen()}
                        disabled={!productId || loading}
                    >
                        Agregar variante
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {!productId && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Guarda el producto primero para poder agregar variantes
                    </Alert>
                )}

                {variants.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                        No hay variantes agregadas
                    </Typography>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Talla</TableCell>
                                    <TableCell>Color</TableCell>
                                    <TableCell>SKU</TableCell>
                                    <TableCell align="center">Stock</TableCell>
                                    <TableCell align="center">Estado</TableCell>
                                    <TableCell align="right">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {variants.map((variant, index) => (
                                    <TableRow key={variant._id || index}>
                                        <TableCell>{variant.talla}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box
                                                    sx={{
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: 1,
                                                        backgroundColor: variant.color.codigoHex,
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                    }}
                                                />
                                                {variant.color.nombre}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{variant.sku}</TableCell>
                                        <TableCell align="center">{variant.stock}</TableCell>
                                        <TableCell align="center">
                                            {variant.activo ? 'Activo' : 'Inactivo'}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleOpen(index)}
                                                disabled={loading}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleDelete(index)}
                                                disabled={loading}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {editingVariantId ? 'Editar Variante' : 'Nueva Variante'}
                    </DialogTitle>
                    <DialogContent>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        
                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Talla</InputLabel>
                                    <Select
                                        value={variantData.talla}
                                        onChange={handleChange('talla')}
                                        label="Talla"
                                        disabled={loading}
                                    >
                                        {SIZES.map((size) => (
                                            <MenuItem key={size} value={size}>
                                                {size}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="SKU"
                                    value={variantData.sku}
                                    onChange={handleChange('sku')}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    fullWidth
                                    label="Nombre del color"
                                    value={variantData.color.nombre}
                                    onChange={handleColorChange('nombre')}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Box>
                                    <Typography variant="caption" display="block" gutterBottom>
                                        Color
                                    </Typography>
                                    <input
                                        type="color"
                                        value={variantData.color.codigoHex}
                                        onChange={handleColorChange('codigoHex')}
                                        disabled={loading}
                                        style={{
                                            width: '100%',
                                            height: 40,
                                            border: '1px solid #ccc',
                                            borderRadius: 4,
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                        }}
                                    />
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Stock"
                                    type="number"
                                    value={variantData.stock}
                                    onChange={handleChange('stock')}
                                    inputProps={{ min: 0 }}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Estado</InputLabel>
                                    <Select
                                        value={variantData.activo}
                                        onChange={handleChange('activo')}
                                        label="Estado"
                                        disabled={loading}
                                    >
                                        <MenuItem value={true}>Activo</MenuItem>
                                        <MenuItem value={false}>Inactivo</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleSave} 
                            variant="contained"
                            disabled={loading}
                            startIcon={loading && <CircularProgress size={20} />}
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </CardContent>
        </Card>
    );
}