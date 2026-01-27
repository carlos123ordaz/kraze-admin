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
    Avatar,
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@mui/material';
import { Add, Edit, Delete, Category as CategoryIcon } from '@mui/icons-material';
import PageHeader from '../../../components/common/PageHeader';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import FileUpload from '../../../components/common/FileUpload';
import axios from '../../../lib/axios';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialog, setDialog] = useState({ open: false, data: null });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/categories');
            setCategories(data.categorias || []);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (category = null) => {
        setDialog({
            open: true,
            data: category || {
                nombre: '',
                descripcion: '',
                imagen: null,
                activo: true,
            },
        });
    };

    const handleCloseDialog = () => {
        setDialog({ open: false, data: null });
    };

    const handleSave = async () => {
        try {
            // Transformar la imagen al formato esperado por el modelo
            const dataToSend = {
                ...dialog.data,
                imagen: dialog.data.imagen ? {
                    url: dialog.data.imagen.publicUrl || dialog.data.imagen.url,
                    alt: dialog.data.nombre || 'Imagen de categoría'
                } : null
            };

            if (dialog.data._id) {
                await axios.put(`/categories/${dialog.data._id}`, dataToSend);
            } else {
                await axios.post('/categories', dataToSend);
            }
            fetchCategories();
            handleCloseDialog();
        } catch (error) {
            console.error('Error al guardar categoría:', error);
            alert('Error al guardar categoría');
        }
    };
    const handleDelete = async () => {
        try {
            await axios.delete(`/categories/${deleteDialog.id}`);
            fetchCategories();
            setDeleteDialog({ open: false, id: null });
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            alert('Error al eliminar categoría');
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
                title="Categorías"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Categorías', href: '/categories' },
                ]}
                actionLabel="Nueva categoría"
                actionIcon={<Add />}
                onAction={() => handleOpenDialog()}
            />

            <Card>
                <CardContent>
                    {loading ? (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                            Cargando...
                        </Typography>
                    ) : categories.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                            No hay categorías creadas
                        </Typography>
                    ) : (
                        <List>
                            {categories.map((category, index) => (
                                <ListItem
                                    key={category._id}
                                    secondaryAction={
                                        <Box>
                                            <IconButton onClick={() => handleOpenDialog(category)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton onClick={() => setDeleteDialog({ open: true, id: category._id })}>
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    }
                                    sx={{
                                        borderBottom: index < categories.length - 1 ? '1px solid' : 'none',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            src={category.imagen?.url}
                                            variant="rounded"
                                            sx={{ bgcolor: 'primary.light' }}
                                        >
                                            <CategoryIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={category.nombre}
                                        secondary={category.descripcion}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>

            <Dialog open={dialog.open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {dialog.data?._id ? 'Editar Categoría' : 'Nueva Categoría'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                value={dialog.data?.nombre || ''}
                                onChange={handleChange('nombre')}
                                required
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Descripción"
                                value={dialog.data?.descripcion || ''}
                                onChange={handleChange('descripcion')}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Typography variant="body2" gutterBottom>
                                Imagen
                            </Typography>
                            <FileUpload
                                value={dialog.data?.imagen ? [dialog.data.imagen] : []}
                                onChange={(images) => setDialog({
                                    ...dialog,
                                    data: { ...dialog.data, imagen: images[0] || null }
                                })}
                                folder="categorias"
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
                title="Eliminar categoría"
                message="¿Estás seguro de que deseas eliminar esta categoría?"
                confirmText="Eliminar"
                severity="error"
            />
        </Box>
    );
}