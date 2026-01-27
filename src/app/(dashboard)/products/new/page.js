'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Alert } from '@mui/material';
import PageHeader from '../../../../components/common/PageHeader';
import ProductForm from '../../../../components/products/ProductForm';
import VariantForm from '../../../../components/products/VariantForm';
import axios from '../../../../lib/axios';

export default function NewProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [productData, setProductData] = useState({
        variantes: [],
    });

    useEffect(() => {
        fetchCategories();
    }, []);

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
            setLoading(true);
            setError('');

            const dataToSend = {
                ...formData,
                variantes: productData.variantes,
            };

            await axios.post('/products', dataToSend);
            router.push('/products');
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al crear producto');
            setLoading(false);
        }
    };

    const handleVariantsChange = (variants) => {
        setProductData({ ...productData, variantes: variants });
    };

    return (
        <Box>
            <PageHeader
                title="Nuevo Producto"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Productos', href: '/products' },
                    { label: 'Nuevo', href: '/products/new' },
                ]}
            />

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <ProductForm
                categories={categories}
                onSubmit={handleSubmit}
                loading={loading}
            />

            <Box sx={{ mt: 3 }}>
                <VariantForm
                    variants={productData.variantes}
                    onChange={handleVariantsChange}
                />
            </Box>
        </Box>
    );
}