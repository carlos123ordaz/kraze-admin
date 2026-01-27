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
    Chip,
} from '@mui/material';
import { Add, Edit, Delete, Collections as CollectionsIcon } from '@mui/icons-material';
import PageHeader from '../../../components/common/PageHeader';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import FileUpload from '../../../components/common/FileUpload';
import axios from '../../../lib/axios';

export default function CollectionsPage() {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialog, setDialog] = useState({ open: false, data: null });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/collections');
            setCollections(data.colecciones || []);
        } catch (error) {
            console.error('Error al cargar colecciones:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (collection = null) => {
        setDialog({
            open: true,
            data: collection || {
                nombre: '',
                descripcion: '',
                imagen: null,
                destacado: false,
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
                await axios.put(`/collections/${dialog.data._id}`, dialog.data);
            } else {
                await axios.post('/collections', dialog.data);
            }
            fetchCollections();
            handleCloseDialog();
        } catch (error) {
            console.error('Error al guardar colección:', error);
            alert('Error al guardar colección');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/collections/${deleteDialog.id}`);
            fetchCollections();
            setDeleteDialog({ open: false, id: null });
        } catch (error) {
            console.error('Error al eliminar colección:', error);
            alert('Error al eliminar colección');
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
                title="Colecciones"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Colecciones', href: '/collections' },
                ]}
                actionLabel="Nueva colección"
                actionIcon={<Add />}
                onAction={() => handleOpenDialog()}
            />

            <Card>
                <CardContent>
                    {loading ? (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                            Cargando...
                        </Typography>
                    ) : collections.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                            No hay colecciones creadas
                        </Typography>
                    ) : (
                        <List>
                            {collections.map((collection, index) => (
                                <ListItem
                                    key={collection._id}
                                    secondaryAction={
                                        <Box>
                                            <IconButton onClick={() => handleOpenDialog(collection)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton onClick={() => setDeleteDialog({ open: true, id: collection._id })}>
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    }
                                    sx={{
                                        borderBottom: index < collections.length - 1 ? '1px solid' : 'none',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            src={collection.imagen?.url}
                                            variant="rounded"
                                            sx={{ bgcolor: 'secondary.light' }}
                                        >
                                            <CollectionsIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {collection.nombre}
                                                {collection.destacado && (
                                                    <Chip label="Destacado" size="small" color="primary" />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" component="span">
                                                    {collection.descripcion}
                                                </Typography>
                                                <Typography variant="caption" display="block" color="text.secondary">
                                                    {collection.productos?.length || 0} productos
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
                    {dialog.data?._id ? 'Editar Colección' : 'Nueva Colección'}
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
                                folder="colecciones"
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
                title="Eliminar colección"
                message="¿Estás seguro de que deseas eliminar esta colección?"
                confirmText="Eliminar"
                severity="error"
            />
        </Box>
    );
}