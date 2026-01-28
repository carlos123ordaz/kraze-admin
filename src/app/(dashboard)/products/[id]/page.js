'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Box, Alert } from '@mui/material';
import PageHeader from '../../../../components/common/PageHeader';
import ProductForm from '../../../../components/products/ProductForm';
import VariantForm from '../../../../components/products/VariantForm';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import axios from '../../../../lib/axios';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id;

    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (productId) {
            fetchProduct();
            fetchCategories();
        }
    }, [productId]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            // Cambiar a la nueva ruta /id/:id
            const { data } = await axios.get(`/products/id/${productId}`);
            setProduct(data.producto);
        } catch (error) {
            console.error('Error al cargar producto:', error);
            setError(error.response?.data?.mensaje || 'Error al cargar el producto');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('/categories');
            setCategories(data.categorias || []);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);
            setError('');

            await axios.put(`/products/${productId}`, formData);
            router.push('/products');
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al actualizar producto');
            setSaving(false);
        }
    };

    const handleVariantsChange = (variants) => {
        setProduct({ ...product, variantes: variants });
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error && !product) {
        return (
            <Box>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!product) {
        return (
            <Box>
                <Alert severity="error">Producto no encontrado</Alert>
            </Box>
        );
    }

    return (
        <Box>
            <PageHeader
                title="Editar Producto"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Productos', href: '/products' },
                    { label: product.nombre, href: `/products/${productId}` },
                ]}
            />

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <ProductForm
                initialValues={product}
                categories={categories}
                onSubmit={handleSubmit}
                loading={saving}
            />

            <Box sx={{ mt: 3 }}>
                <VariantForm
                    variants={product.variantes || []}
                    onChange={handleVariantsChange}
                />
            </Box>
        </Box>
    );
}