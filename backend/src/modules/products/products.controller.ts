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

    async create(req: Request, res: Response) {
        try {
            // Construimos la URL de la imagen si se subió un archivo
            let imagenUrl = '';
            if (req.file) {
                // Ejemplo: http://localhost:4000/uploads/foto-123.jpg
                imagenUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            } else if (req.body.imagenUrl) {
                // Si no subió archivo pero mandó un link de internet
                imagenUrl = req.body.imagenUrl;
            }

            const data = {
                codigo: req.body.codigo,
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                imagenUrl: imagenUrl, // 👈 Usamos la URL generada
                
                // Multer convierte todo a texto, así que SIEMPRE parseamos
                precioCompra: parseFloat(req.body.precioCompra),
                precioVenta: parseFloat(req.body.precioVenta),
                stock: parseInt(req.body.stock),
                categoriaId: parseInt(req.body.categoriaId)
            };

            const product = await productsService.create(data);
            res.status(201).json(product);
        } catch (error: any) {
            if (error.code === 'P2002') return res.status(400).json({ error: 'Código duplicado' });
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data: any = { ...req.body };

            // Si hay nueva imagen, actualizamos la URL
            if (req.file) {
                data.imagenUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            }

            // Conversiones necesarias
            if (req.body.stock) data.stock = parseInt(req.body.stock);
            if (req.body.categoriaId) data.categoriaId = parseInt(req.body.categoriaId);
            if (req.body.precioCompra) data.precioCompra = parseFloat(req.body.precioCompra);
            if (req.body.precioVenta) data.precioVenta = parseFloat(req.body.precioVenta);

            const product = await productsService.update(Number(id), data);
            res.json(product);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
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
