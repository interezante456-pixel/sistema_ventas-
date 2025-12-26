import { Request, Response } from 'express';
import salesService from './sales.service';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { env } from '../../config/env';

class SalesController {
    async getAll(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const role = user?.rol;
            const userId = user?.id;

            const filterUserId = (role === 'VENDEDOR') ? userId : undefined;

            const sales = await salesService.getAll(filterUserId);
            res.json(sales);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const sale = await salesService.getById(Number(req.params.id));
            if (!sale) return res.status(404).json({ error: 'Venta no encontrada' });
            res.json(sale);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            // Asumimos que el middleware verifyToken agrega el usuario a req
            const userId = (req as any).user.id;
            const data = { ...req.body, usuarioId: userId };

            const sale = await salesService.create(data);
            res.status(201).json(sale);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async cancel(req: Request, res: Response) {
        try {
            const sale = await salesService.cancelSale(Number(req.params.id));
            res.json({ message: 'Venta anulada correctamente', sale });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async sendTicketEmail(req: Request, res: Response) {
        try {
            const saleId = Number(req.params.id);
            const { email } = req.body;
            const file = req.file;

            if (!file) {
                return res.status(400).json({ error: 'No se recibió el archivo PDF' });
            }

            if (!email) {
                return res.status(400).json({ error: 'No se recibió el correo electrónico' });
            }

            // 1. Configurar Transporter (SMTP)
            if (!env.SMTP_USER || !env.SMTP_PASS) {
                throw new Error('Las credenciales de correo (SMTP_USER / SMTP_PASS) no están configuradas en el .env del servidor');
            }

            const transporter = nodemailer.createTransport({
                service: env.SMTP_SERVICE, 
                auth: {
                    user: env.SMTP_USER,
                    pass: env.SMTP_PASS
                }
            });

            // 2. Enviar Correo
            await transporter.sendMail({
                from: '"SIVRA Market" <no-reply@sivramarket.com>',
                to: email,
                subject: `Comprobante de Venta #${saleId} - SIVRA Market`,
                text: `Estimado cliente, adjunto encontrará su comprobante de venta #${saleId}. Gracias por su compra.`,
                attachments: [
                    {
                        filename: `Ticket_Venta_${saleId}.pdf`,
                        content: fs.createReadStream(file.path)
                    }
                ]
            });

            // 3. Limpiar archivo temporal
            fs.unlinkSync(file.path);

            res.json({ message: 'Correo enviado correctamente' });

        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: 'Error enviando el correo: ' + error.message });
        }
    }
}

export default new SalesController();