'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    Typography,
    Rating,
    IconButton,
    Chip,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@mui/material';
import { CheckCircle, Cancel, Visibility } from '@mui/icons-material';
import PageHeader from '../../../components/common/PageHeader';
import SearchBar from '../../../components/common/SearchBar';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { formatDateTime } from '../../../lib/utils';
import axios from '../../../lib/axios';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        buscar: '',
        estado: '',
        calificacion: '',
    });
    const [actionDialog, setActionDialog] = useState({ open: false, id: null, action: null });

    useEffect(() => {
        fetchReviews();
    }, [filters]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const { data } = await axios.get(`/reviews?${params}`);
            setReviews(data.resenas || []);
        } catch (error) {
            console.error('Error al cargar reseñas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            await axios.put(`/reviews/${actionDialog.id}/aprobar`);
            fetchReviews();
            setActionDialog({ open: false, id: null, action: null });
        } catch (error) {
            console.error('Error al aprobar reseña:', error);
            alert('Error al aprobar reseña');
        }
    };

    const handleReject = async () => {
        try {
            await axios.put(`/reviews/${actionDialog.id}/rechazar`);
            fetchReviews();
            setActionDialog({ open: false, id: null, action: null });
        } catch (error) {
            console.error('Error al rechazar reseña:', error);
            alert('Error al rechazar reseña');
        }
    };

    const handleFilterChange = (field) => (event) => {
        setFilters({ ...filters, [field]: event.target.value });
    };

    const handleSearchChange = (event) => {
        setFilters({ ...filters, buscar: event.target.value });
    };

    return (
        <Box>
            <PageHeader
                title="Reseñas"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Reseñas', href: '/reviews' },
                ]}
            />

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <SearchBar
                        value={filters.buscar}
                        onChange={handleSearchChange}
                        placeholder="Buscar por producto o cliente..."
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3, sm: 6 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Estado</InputLabel>
                        <Select
                            value={filters.estado}
                            onChange={handleFilterChange('estado')}
                            label="Estado"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="pendiente">Pendiente</MenuItem>
                            <MenuItem value="aprobado">Aprobado</MenuItem>
                            <MenuItem value="rechazado">Rechazado</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 3, sm: 6 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Calificación</InputLabel>
                        <Select
                            value={filters.calificacion}
                            onChange={handleFilterChange('calificacion')}
                            label="Calificación"
                        >
                            <MenuItem value="">Todas</MenuItem>
                            <MenuItem value="5">5 estrellas</MenuItem>
                            <MenuItem value="4">4 estrellas</MenuItem>
                            <MenuItem value="3">3 estrellas</MenuItem>
                            <MenuItem value="2">2 estrellas</MenuItem>
                            <MenuItem value="1">1 estrella</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Card>
                <CardContent>
                    {loading ? (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                            Cargando...
                        </Typography>
                    ) : reviews.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                            No hay reseñas para mostrar
                        </Typography>
                    ) : (
                        <List>
                            {reviews.map((review, index) => (
                                <ListItem
                                    key={review._id}
                                    alignItems="flex-start"
                                    secondaryAction={
                                        review.estado === 'pendiente' && (
                                            <Box>
                                                <IconButton
                                                    color="success"
                                                    onClick={() => setActionDialog({ open: true, id: review._id, action: 'approve' })}
                                                >
                                                    <CheckCircle />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => setActionDialog({ open: true, id: review._id, action: 'reject' })}
                                                >
                                                    <Cancel />
                                                </IconButton>
                                            </Box>
                                        )
                                    }
                                    sx={{
                                        borderBottom: index < reviews.length - 1 ? '1px solid' : 'none',
                                        borderColor: 'divider',
                                        py: 2,
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar src={review.producto?.imagenesPrincipales?.[0]?.url} variant="rounded" />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box>
                                                <Typography variant="body2" fontWeight={600} gutterBottom>
                                                    {review.producto?.nombre || 'Producto eliminado'}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <Rating value={review.calificacion} size="small" readOnly />
                                                    <Chip
                                                        label={review.estado}
                                                        size="small"
                                                        color={
                                                            review.estado === 'aprobado' ? 'success' :
                                                                review.estado === 'rechazado' ? 'error' : 'warning'
                                                        }
                                                    />
                                                </Box>
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                {review.titulo && (
                                                    <Typography variant="body2" fontWeight={500} gutterBottom>
                                                        {review.titulo}
                                                    </Typography>
                                                )}
                                                <Typography variant="body2" color="text.secondary" paragraph>
                                                    {review.comentario}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Por {review.usuario?.nombres} {review.usuario?.apellidos} • {formatDateTime(review.createdAt)}
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

            <ConfirmDialog
                open={actionDialog.open}
                onClose={() => setActionDialog({ open: false, id: null, action: null })}
                onConfirm={actionDialog.action === 'approve' ? handleApprove : handleReject}
                title={actionDialog.action === 'approve' ? 'Aprobar reseña' : 'Rechazar reseña'}
                message={`¿Estás seguro de que deseas ${actionDialog.action === 'approve' ? 'aprobar' : 'rechazar'} esta reseña?`}
                confirmText={actionDialog.action === 'approve' ? 'Aprobar' : 'Rechazar'}
                severity={actionDialog.action === 'approve' ? 'success' : 'error'}
            />
        </Box>
    );
}