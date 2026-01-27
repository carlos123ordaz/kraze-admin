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
    FormControlLabel,
    Switch,
    InputAdornment,
    Typography,
    Divider,
    Chip,
    IconButton,
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import FileUpload from '../common/FileUpload';
import { GENDERS, SIZES } from '../../lib/constants';

export default function ProductForm({
    initialValues = {},
    categories = [],
    onSubmit,
    loading = false,
}) {
    const [formData, setFormData] = useState({
        nombre: initialValues.nombre || '',
        descripcionCorta: initialValues.descripcionCorta || '',
        descripcionCompleta: initialValues.descripcionCompleta || '',
        categoria: initialValues.categoria?._id || '',
        genero: initialValues.genero || '',
        marca: initialValues.marca || '',
        precio: initialValues.precio || '',
        sku: initialValues.sku || '',
        imagenesPrincipales: initialValues.imagenesPrincipales || [],
        variantes: initialValues.variantes || [],
        tags: initialValues.tags || [],
        destacado: initialValues.destacado || false,
        nuevo: initialValues.nuevo || false,
        estado: initialValues.estado || 'activo',
        descuento: initialValues.descuento || { activo: false, porcentaje: 0 },
        guiaTallas: initialValues.guiaTallas || {},
    });

    const [newTag, setNewTag] = useState('');

    const handleChange = (field) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setFormData({ ...formData, [field]: value });
    };

    const handleNestedChange = (parent, field) => (event) => {
        setFormData({
            ...formData,
            [parent]: {
                ...formData[parent],
                [field]: event.target.value,
            },
        });
    };

    const handleAddTag = () => {
        if (newTag && !formData.tags.includes(newTag)) {
            setFormData({ ...formData, tags: [...formData.tags, newTag] });
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(tag => tag !== tagToRemove),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar campos requeridos
        if (!formData.nombre?.trim()) {
            alert('El nombre es requerido');
            return;
        }

        if (!formData.categoria) {
            alert('La categoría es requerida');
            return;
        }

        if (!formData.precio || formData.precio <= 0) {
            alert('El precio debe ser mayor a 0');
            return;
        }

        if (!formData.imagenesPrincipales || formData.imagenesPrincipales.length === 0) {
            alert('Debes subir al menos una imagen');
            return;
        }

        // Transformar datos...
        const dataToSend = {
            ...formData,
            imagenesPrincipales: formData.imagenesPrincipales.map((img, index) => ({
                url: img.publicUrl || img.url,
                alt: img.alt || formData.nombre || 'Imagen de producto',
                orden: index
            })),
            descuento: {
                activo: Boolean(formData.descuento?.activo),
                porcentaje: Number(formData.descuento?.porcentaje) || 0
            }
        };

        onSubmit(dataToSend);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }} md={8}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Información Básica
                            </Typography>

                            <TextField
                                fullWidth
                                label="Nombre del producto"
                                value={formData.nombre}
                                onChange={handleChange('nombre')}
                                required
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                label="Descripción corta"
                                value={formData.descripcionCorta}
                                onChange={handleChange('descripcionCorta')}
                                multiline
                                rows={2}
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                label="Descripción completa"
                                value={formData.descripcionCompleta}
                                onChange={handleChange('descripcionCompleta')}
                                multiline
                                rows={4}
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Imágenes
                            </Typography>
                            <FileUpload
                                multiple
                                maxFiles={10}
                                value={formData.imagenesPrincipales}
                                onChange={(images) => setFormData({ ...formData, imagenesPrincipales: images })}
                                folder="productos"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Pricing
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Precio"
                                        type="number"
                                        value={formData.precio}
                                        onChange={handleChange('precio')}
                                        required
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">S/</InputAdornment>,
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="SKU"
                                        value={formData.sku}
                                        onChange={handleChange('sku')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Divider sx={{ my: 2 }} />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.descuento?.activo}
                                                onChange={handleNestedChange('descuento', 'activo')}
                                            />
                                        }
                                        label="Aplicar descuento"
                                    />
                                </Grid>

                                {formData.descuento?.activo && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Porcentaje de descuento"
                                            type="number"
                                            value={formData.descuento.porcentaje}
                                            onChange={handleNestedChange('descuento', 'porcentaje')}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                            }}
                                            inputProps={{ min: 0, max: 100 }}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12 }} md={4}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Estado
                            </Typography>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    value={formData.estado}
                                    onChange={handleChange('estado')}
                                    label="Estado"
                                >
                                    <MenuItem value="borrador">Borrador</MenuItem>
                                    <MenuItem value="activo">Activo</MenuItem>
                                    <MenuItem value="agotado">Agotado</MenuItem>
                                    <MenuItem value="descontinuado">Descontinuado</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.destacado}
                                        onChange={handleChange('destacado')}
                                    />
                                }
                                label="Producto destacado"
                                sx={{ display: 'block', mb: 1 }}
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.nuevo}
                                        onChange={handleChange('nuevo')}
                                    />
                                }
                                label="Producto nuevo"
                                sx={{ display: 'block' }}
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Organización
                            </Typography>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Categoría</InputLabel>
                                <Select
                                    value={formData.categoria}
                                    onChange={handleChange('categoria')}
                                    label="Categoría"
                                >
                                    <MenuItem value="">Sin categoría</MenuItem>
                                    {categories.map((cat) => (
                                        <MenuItem key={cat._id} value={cat._id}>
                                            {cat.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Género</InputLabel>
                                <Select
                                    value={formData.genero}
                                    onChange={handleChange('genero')}
                                    label="Género"
                                >
                                    {GENDERS.map((gender) => (
                                        <MenuItem key={gender.value} value={gender.value}>
                                            {gender.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Marca"
                                value={formData.marca}
                                onChange={handleChange('marca')}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Tags
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Agregar tag"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddTag();
                                        }
                                    }}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={handleAddTag}
                                    sx={{ minWidth: 'auto', px: 2 }}
                                >
                                    <Add />
                                </Button>
                            </Box>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {formData.tags.map((tag, index) => (
                                    <Chip
                                        key={index}
                                        label={tag}
                                        onDelete={() => handleRemoveTag(tag)}
                                        size="small"
                                    />
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button variant="outlined" size="large">
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar producto'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </form>
    );
}