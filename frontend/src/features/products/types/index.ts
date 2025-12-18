export type Product = {
  id: number
  codigo: string
  nombre: string
  descripcion?: string
  precioCompra?: number
  precioVenta: number
  stock: number
}

export default Product
