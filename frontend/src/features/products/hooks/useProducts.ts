import { useState, useEffect } from 'react';
import api from '../../../config/api';

export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrRestore = async (product: any) => {
    if (!product) return;
    try {
      const nuevoEstado = !product.estado;
      await api.patch(`/products/${product.id}`, { estado: nuevoEstado });
      setToast({ 
        msg: nuevoEstado ? 'Producto restaurado' : 'Producto eliminado', 
        type: 'success' 
      });
      fetchProducts();
      return true; // Éxito
    } catch (error) {
      setToast({ msg: 'Error al procesar', type: 'error' });
      return false; // Error
    }
  };

  const filteredProducts = products.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    products,
    filteredProducts,
    loading,
    searchTerm,
    setSearchTerm,
    toast,
    setToast,
    fetchProducts,
    handleDeleteOrRestore
  };
};
