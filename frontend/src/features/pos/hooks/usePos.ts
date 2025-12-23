import { useState, useEffect } from 'react';
import api from '../../../config/api';

export const usePos = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [posError, setPosError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [prodRes, catRes] = await Promise.all([
                api.get("/products"),
                api.get("/categories"),
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (error) {
            console.error("Error cargando datos:", error);
            setPosError("Error al cargar el catálogo de productos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filtrado de productos visual
    const filteredProducts = products.filter((p) => {
        const matchesSearch =
            p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.codigo.includes(searchTerm);
        const matchesCategory = selectedCategory
            ? p.categoriaId === selectedCategory
            : true;
        return matchesSearch && matchesCategory && p.estado; // Solo mostrar activos
    });

    const refreshProducts = () => {
        // Recargar productos para actualizar stock visualmente
        api.get("/products").then(res => setProducts(res.data)).catch(console.error);
    };

    return {
        products,
        categories,
        filteredProducts,
        loading,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        posError,
        refreshProducts
    };
};
