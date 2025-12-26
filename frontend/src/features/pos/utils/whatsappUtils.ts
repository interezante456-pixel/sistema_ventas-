export const getSaleWhatsAppUrl = (sale: any): string => {
    const telefono = sale.cliente?.telefono;
    const mensaje = `Hola, gracias por tu compra en SIVRA Market. Aquí tienes el resumen de tu compra #${sale.id} por *S/ ${Number(sale.total).toFixed(2)}*.`;
    return `https://wa.me/${telefono ? '51'+telefono : ''}?text=${encodeURIComponent(mensaje)}`;
};
