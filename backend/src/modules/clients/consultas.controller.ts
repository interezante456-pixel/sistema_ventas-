import { Request, Response } from 'express';

class ConsultasController {
    
    // Variables de entorno
    private API_URL = process.env.APIS_URL || "https://dniruc.apisperu.com/api/v1";
    private API_TOKEN = process.env.APIS_TOKEN || "";

    async consultDni(req: Request, res: Response) {
        try {
            const { dni } = req.params;
            if (!dni || dni.length !== 8) return res.status(400).json({ error: 'DNI inválido' });

            // Según documentación/ejemplo: https://dniruc.apisperu.com/api/v1/dni/{dni}?token={token}
            const response = await fetch(`${this.API_URL}/dni/${dni}?token=${this.API_TOKEN}`, {
                method: 'GET'
            });

            if (!response.ok) {
                if (response.status === 404) return res.status(404).json({ error: 'DNI no encontrado' });
                // El servicio suele devolver 422 o 400 si el token falla o el formato es incorrecto
                return res.status(response.status).json({ error: 'Error al consultar RENIEC' });
            }

            const data = await response.json();
            
            // Verificamos si la respuesta tiene éxito (algunas APIs devuelven success: false)
            if (data.success === false) {
                 return res.status(404).json({ error: data.message || 'DNI no encontrado' });
            }

            // Mapeo: response suele traer { dni, nombres, apellidoPaterno, apellidoMaterno, ... }
            return res.json({
                nombres: `${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`.trim(),
                direccion: data.direccion || '',
                telefono: '' // Esta API generalmente no devuelve teléfono
            });

        } catch (error: any) {
            console.error('Error CONSULT_DNI:', error);
            return res.status(500).json({ error: 'Error interno al consultar DNI' });
        }
    }

    async consultRuc(req: Request, res: Response) {
        try {
            const { ruc } = req.params;
            if (!ruc || ruc.length !== 11) return res.status(400).json({ error: 'RUC inválido' });

            // URL: https://dniruc.apisperu.com/api/v1/ruc/{ruc}?token={token}
            const response = await fetch(`${this.API_URL}/ruc/${ruc}?token=${this.API_TOKEN}`, {
                method: 'GET'
            });

            if (!response.ok) {
                 if (response.status === 404) return res.status(404).json({ error: 'RUC no encontrado' });
                 return res.status(response.status).json({ error: 'Error al consultar SUNAT' });
            }

            const data = await response.json();

             if (data.success === false) {
                 return res.status(404).json({ error: data.message || 'RUC no encontrado' });
            }

            // Mapeo RUC
            // data suele traer { ruc, razonSocial, estado, condicion, direccion, ... }
            return res.json({
                nombres: data.razonSocial || '',
                direccion: data.direccion || data.domicilioFiscal || '',
                estado: data.estado || '',
                condicion: data.condicion || '',
                telefono: '' // A veces no retorna teléfono
            });

        } catch (error: any) {
            console.error('Error CONSULT_RUC:', error);
            return res.status(500).json({ error: 'Error interno al consultar RUC' });
        }
    }
}

export default new ConsultasController();
