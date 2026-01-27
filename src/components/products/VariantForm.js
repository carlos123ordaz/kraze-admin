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
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { SIZES } from '../../lib/constants';

export default function VariantForm({ variants = [], onChange }) {
    const [open, setOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [variantData, setVariantData] = useState({
        talla: '',
        color: { nombre: '', codigoHex: '#000000' },
        sku: '',
        stock: 0,
        activo: true,
    });

    const handleOpen = (index = null) => {
        if (index !== null) {
            setVariantData(variants[index]);
            setEditingIndex(index);
        } else {
            setVariantData({
                talla: '',
                color: { nombre: '', codigoHex: '#000000' },
                sku: '',
                stock: 0,
                activo: true,
            });
            setEditingIndex(null);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingIndex(null);
    };

    const handleSave = () => {
        if (editingIndex !== null) {
            const updated = [...variants];
            updated[editingIndex] = variantData;
            onChange(updated);
        } else {
            onChange([...variants, variantData]);
        }
        handleClose();
    };

    const handleDelete = (index) => {
        const updated = variants.filter((_, i) => i !== index);
        onChange(updated);
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
                    >
                        Agregar variante
                    </Button>
                </Box>

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
                                    <TableRow key={index}>
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
                                            <IconButton size="small" onClick={() => handleOpen(index)}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleDelete(index)}>
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
                        {editingIndex !== null ? 'Editar Variante' : 'Nueva Variante'}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Talla</InputLabel>
                                    <Select
                                        value={variantData.talla}
                                        onChange={handleChange('talla')}
                                        label="Talla"
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
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }} sm={8}>
                                <TextField
                                    fullWidth
                                    label="Nombre del color"
                                    value={variantData.color.nombre}
                                    onChange={handleColorChange('nombre')}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }} sm={4}>
                                <Box>
                                    <Typography variant="caption" display="block" gutterBottom>
                                        Color
                                    </Typography>
                                    <input
                                        type="color"
                                        value={variantData.color.codigoHex}
                                        onChange={handleColorChange('codigoHex')}
                                        style={{
                                            width: '100%',
                                            height: 40,
                                            border: '1px solid #ccc',
                                            borderRadius: 4,
                                            cursor: 'pointer',
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
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Estado</InputLabel>
                                    <Select
                                        value={variantData.activo}
                                        onChange={handleChange('activo')}
                                        label="Estado"
                                    >
                                        <MenuItem value={true}>Activo</MenuItem>
                                        <MenuItem value={false}>Inactivo</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button onClick={handleSave} variant="contained">
                            Guardar
                        </Button>
                    </DialogActions>
                </Dialog>
            </CardContent>
        </Card>
    );
}