'use client';

import { useState } from 'react';
import {
    Box,
    Button,
    IconButton,
    Typography,
    Paper,
    CircularProgress,
    Grid,
} from '@mui/material';
import { CloudUpload, Delete, Image as ImageIcon } from '@mui/icons-material';
import axios from '../../lib/axios';

export default function FileUpload({
    multiple = false,
    maxFiles = 10,
    onChange,
    value = [],
    folder = 'productos',
}) {
    const [uploading, setUploading] = useState(false);
    const [previews, setPreviews] = useState(value);

    const handleFileSelect = async (event) => {
        const files = Array.from(event.target.files);

        if (!multiple && files.length > 1) {
            alert('Solo puedes subir un archivo');
            return;
        }

        if (previews.length + files.length > maxFiles) {
            alert(`Máximo ${maxFiles} archivos`);
            return;
        }

        setUploading(true);

        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append(multiple ? 'images' : 'file', file);

                const { data } = await axios.post(
                    `/upload/${multiple ? 'imagenes' : 'imagen'}?folder=${folder}`,
                    formData,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    }
                );

                return multiple ? data.archivos[0] : data.archivo;
            });

            const uploaded = await Promise.all(uploadPromises);
            const newPreviews = [...previews, ...uploaded];
            setPreviews(newPreviews);

            if (onChange) {
                onChange(newPreviews);
            }
        } catch (error) {
            alert('Error al subir archivos: ' + (error.response?.data?.mensaje || error.message));
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = (index) => {
        const newPreviews = previews.filter((_, i) => i !== index);
        setPreviews(newPreviews);

        if (onChange) {
            onChange(newPreviews);
        }
    };

    return (
        <Box>
            <input
                type="file"
                id="file-upload"
                multiple={multiple}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                disabled={uploading}
            />

            {previews.length === 0 ? (
                <Paper
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        border: '2px dashed',
                        borderColor: 'divider',
                        backgroundColor: 'background.default',
                        cursor: 'pointer',
                        '&:hover': {
                            borderColor: 'primary.main',
                            backgroundColor: 'action.hover',
                        },
                    }}
                    onClick={() => document.getElementById('file-upload').click()}
                >
                    {uploading ? (
                        <CircularProgress size={40} />
                    ) : (
                        <>
                            <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="body1" gutterBottom>
                                Haz clic para subir {multiple ? 'imágenes' : 'una imagen'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                PNG, JPG hasta 5MB
                            </Typography>
                        </>
                    )}
                </Paper>
            ) : (
                <Box>
                    <Grid container spacing={2}>
                        {previews.map((preview, index) => (
                            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                                <Paper
                                    sx={{
                                        position: 'relative',
                                        paddingTop: '100%',
                                        overflow: 'hidden',
                                        '&:hover .delete-button': {
                                            opacity: 1,
                                        },
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={preview.publicUrl || preview.url}
                                        alt={`Preview ${index + 1}`}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <IconButton
                                        className="delete-button"
                                        onClick={() => handleRemove(index)}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            color: 'white',
                                            opacity: 0,
                                            transition: 'opacity 0.2s',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                            },
                                        }}
                                        size="small"
                                    >
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Paper>
                            </Grid>
                        ))}

                        {multiple && previews.length < maxFiles && (
                            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                                <Paper
                                    sx={{
                                        paddingTop: '100%',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        border: '2px dashed',
                                        borderColor: 'divider',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            backgroundColor: 'action.hover',
                                        },
                                    }}
                                    onClick={() => document.getElementById('file-upload').click()}
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {uploading ? (
                                            <CircularProgress size={32} />
                                        ) : (
                                            <>
                                                <CloudUpload sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                                                <Typography variant="caption" display="block">
                                                    Agregar más
                                                </Typography>
                                            </>
                                        )}
                                    </Box>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            )}
        </Box>
    );
}