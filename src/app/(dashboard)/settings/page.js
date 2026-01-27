'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Grid,
    Button,
    Typography,
    Divider,
    Alert,
    Snackbar,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import PageHeader from '../../../components/common/PageHeader';
import axios from '../../../lib/axios';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        nombreTienda: '',
        emailContacto: '',
        telefono: '',
        direccion: '',
        whatsapp: '',
        facebook: '',
        instagram: '',
        descripcionTienda: '',
        horarioAtencion: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/settings');
            if (data.configuracion) {
                setSettings(data.configuracion);
            }
        } catch (error) {
            console.error('Error al cargar configuración:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field) => (event) => {
        setSettings({ ...settings, [field]: event.target.value });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await axios.put('/settings', settings);
            setSnackbar({
                open: true,
                message: 'Configuración guardada correctamente',
                severity: 'success',
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error al guardar configuración',
                severity: 'error',
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box>
                <PageHeader title="Configuración" />
                <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                    Cargando...
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <PageHeader
                title="Configuración"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Configuración', href: '/settings' },
                ]}
            />

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Información General
                            </Typography>

                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Nombre de la tienda"
                                        value={settings.nombreTienda}
                                        onChange={handleChange('nombreTienda')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Descripción de la tienda"
                                        value={settings.descripcionTienda}
                                        onChange={handleChange('descripcionTienda')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Email de contacto"
                                        type="email"
                                        value={settings.emailContacto}
                                        onChange={handleChange('emailContacto')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Teléfono"
                                        value={settings.telefono}
                                        onChange={handleChange('telefono')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Dirección"
                                        value={settings.direccion}
                                        onChange={handleChange('direccion')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Horario de atención"
                                        value={settings.horarioAtencion}
                                        onChange={handleChange('horarioAtencion')}
                                        placeholder="Lun - Vie: 9:00 AM - 6:00 PM"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Redes Sociales
                            </Typography>

                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="WhatsApp"
                                        value={settings.whatsapp}
                                        onChange={handleChange('whatsapp')}
                                        placeholder="+51 999 999 999"
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Facebook"
                                        value={settings.facebook}
                                        onChange={handleChange('facebook')}
                                        placeholder="https://facebook.com/..."
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Instagram"
                                        value={settings.instagram}
                                        onChange={handleChange('instagram')}
                                        placeholder="@kraze_store"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12 }} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Información del Sistema
                            </Typography>

                            <Box sx={{ py: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Versión del Admin
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                    1.0.0
                                </Typography>
                            </Box>

                            <Divider />

                            <Box sx={{ py: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Base de datos
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                    MongoDB
                                </Typography>
                            </Box>

                            <Divider />

                            <Box sx={{ py: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Almacenamiento
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                    Google Cloud Storage
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    <Alert severity="info" sx={{ mt: 3 }}>
                        Los cambios en la configuración se aplicarán inmediatamente en toda la plataforma.
                    </Alert>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Save />}
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}