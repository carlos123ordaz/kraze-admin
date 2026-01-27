'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import PageHeader from '../../../components/common/PageHeader';
import SearchBar from '../../../components/common/SearchBar';
import ProductTable from '../../../components/products/ProductTable';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import axios from '../../../lib/axios';
import { GENDERS } from '../../../lib/constants';

export default function ProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        paginaActual: 1,
        total: 0,
        limite: 20,
    });
    const [filters, setFilters] = useState({
        buscar: '',
        categoria: '',
        genero: '',
        estado: '',
        pagina: 1,
        limite: 20,
    });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [filters]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const { data } = await axios.get(`/products?${params}`);
            setProducts(data.productos);
            setPagination({
                paginaActual: data.paginaActual,
                total: data.total,
                limite: data.limite || 20,
            });
        } catch (error) {
            console.error('Error al cargar productos:', error);
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

    const handleFilterChange = (field) => (event) => {
        setFilters({ ...filters, [field]: event.target.value, pagina: 1 });
    };

    const handleSearchChange = (event) => {
        setFilters({ ...filters, buscar: event.target.value, pagina: 1 });
    };

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, pagina: newPage });
    };

    const handleDelete = (id) => {
        setDeleteDialog({ open: true, id });
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/products/${deleteDialog.id}`);
            fetchProducts();
            setDeleteDialog({ open: false, id: null });
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            alert('Error al eliminar producto');
        }
    };

    return (
        <Box>
            <PageHeader
                title="Productos"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Productos', href: '/products' },
                ]}
                actionLabel="Agregar producto"
                actionIcon={<Add />}
                onAction={() => router.push('/products/new')}
            />

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12 }} md={4}>
                    <SearchBar
                        value={filters.buscar}
                        onChange={handleSearchChange}
                        placeholder="Buscar productos..."
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Categoría</InputLabel>
                        <Select
                            value={filters.categoria}
                            onChange={handleFilterChange('categoria')}
                            label="Categoría"
                        >
                            <MenuItem value="">Todas</MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat._id} value={cat._id}>
                                    {cat.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Género</InputLabel>
                        <Select
                            value={filters.genero}
                            onChange={handleFilterChange('genero')}
                            label="Género"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {GENDERS.map((gender) => (
                                <MenuItem key={gender.value} value={gender.value}>
                                    {gender.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Estado</InputLabel>
                        <Select
                            value={filters.estado}
                            onChange={handleFilterChange('estado')}
                            label="Estado"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="activo">Activo</MenuItem>
                            <MenuItem value="borrador">Borrador</MenuItem>
                            <MenuItem value="agotado">Agotado</MenuItem>
                            <MenuItem value="descontinuado">Descontinuado</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <ProductTable
                products={products}
                loading={loading}
                pagination={pagination}
                onPageChange={handlePageChange}
                onDelete={handleDelete}
            />

            <ConfirmDialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, id: null })}
                onConfirm={confirmDelete}
                title="Eliminar producto"
                message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                severity="error"
            />
        </Box>
    );
}