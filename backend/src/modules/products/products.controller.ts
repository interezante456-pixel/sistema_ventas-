import { Request, Response } from 'express';
import productsService from './products.service';

class ProductsController {
    
    async getAll(req: Request, res: Response) {
        try {
            const products = await productsService.getAll();
            res.json(products);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const product = await productsService.getById(Number(req.params.id));
            if (!product) return res.status(404).json({ error: 'Product not found' });
            res.json(product);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // 👇 MÉTODO CORREGIDO (CONVERSIÓN DE DATOS)
    async create(req: Request, res: Response) {
        try {
            // Convertimos los strings a números antes de enviarlos al servicio
            const data = {
                codigo: req.body.codigo, // String
                nombre: req.body.nombre, // String
                descripcion: req.body.descripcion, // String (opcional)
                imagenUrl: req.body.imagenUrl, // String (opcional)
                
                // Convertimos "10.50" -> 10.50
                precioCompra: parseFloat(req.body.precioCompra),
                precioVenta: parseFloat(req.body.precioVenta),
                
                // Convertimos "15" -> 15
                stock: parseInt(req.body.stock),
                categoriaId: parseInt(req.body.categoriaId)
            };

            const product = await productsService.create(data);
            res.status(201).json(product);
        } catch (error: any) {
            // Manejo especial si el código de barras ya existe
            if (error.code === 'P2002') {
                return res.status(400).json({ error: 'El código del producto ya existe' });
            }
            console.error(error);
            res.status(400).json({ error: error.message || 'Error al crear producto' });
        }
    }

    // 👇 MÉTODO CORREGIDO (CONVERSIÓN CONDICIONAL)
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            // Copiamos el body original
            const data: any = { ...req.body };

            // Solo convertimos si el dato existe en la petición
            if (req.body.stock) data.stock = parseInt(req.body.stock);
            if (req.body.categoriaId) data.categoriaId = parseInt(req.body.categoriaId);
            if (req.body.precioCompra) data.precioCompra = parseFloat(req.body.precioCompra);
            if (req.body.precioVenta) data.precioVenta = parseFloat(req.body.precioVenta);

            const product = await productsService.update(Number(id), data);
            res.json(product);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ error: error.message || 'Error al actualizar producto' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await productsService.delete(Number(req.params.id));
            res.json({ message: 'Product deleted' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new ProductsController();
