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
            // 👇👇👇 AGREGA ESTOS LOGS DE DEPURACIÓN 👇👇👇
            console.log("\n========================================");
            console.log(`📡 PETICIÓN DE ACTUALIZAR RECIBIDA - ID: ${id}`);
            console.log("📦 Body (Datos de texto):", req.body);
            console.log("📂 Archivo (req.file):", req.file); //
            // 👇 1. Creamos un objeto VACÍO para llenarlo solo con datos válidos
            const dataToUpdate: any = {};

            // 2. Asignamos campos de texto solo si existen
            if (req.body.codigo) dataToUpdate.codigo = req.body.codigo;
            if (req.body.nombre) dataToUpdate.nombre = req.body.nombre;
            if (req.body.descripcion) dataToUpdate.descripcion = req.body.descripcion;

            // 3. Parseamos números (Importante para evitar errores de tipo)
            if (req.body.precioCompra) dataToUpdate.precioCompra = parseFloat(req.body.precioCompra);
            if (req.body.precioVenta) dataToUpdate.precioVenta = parseFloat(req.body.precioVenta);
            if (req.body.stock) dataToUpdate.stock = parseInt(req.body.stock);
            if (req.body.categoriaId) dataToUpdate.categoriaId = parseInt(req.body.categoriaId);

            // 4. Manejo del Estado (FormData envía 'true'/'false' como texto)
            if (req.body.estado !== undefined) {
                dataToUpdate.estado = String(req.body.estado) === 'true';
            }

            // 👇 5. MAGIA: Si hay archivo, guardamos la URL. Si no, NO tocamos el campo.
            if (req.file) {
                console.log("✅ ¡HAY IMAGEN! Procesando URL...");
                dataToUpdate.imagenUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
                console.log("🔗 URL Generada:", dataToUpdate.imagenUrl);
            }
            else {
                console.log("❌ NO HAY IMAGEN (req.file es undefined)");
                console.log("   -> Motivo probable: Error en products.routes.ts (falta upload) o no enviaste archivo.");
            }
            // NOTA: No hacemos nada con req.body.imagenUrl aquí, porque si no suben foto, 
            // no queremos borrar la que ya existe.
            console.log("💾 DATOS FINALES A GUARDAR EN BD:", dataToUpdate);
            console.log("========================================\n");
            // 👆👆👆 FIN DE LOGS 👆👆👆

            const product = await productsService.update(Number(id), dataToUpdate);
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
