import React, { useEffect, useState } from 'react'
import { getProducts } from '../services/product.service'
import { Product } from '../types'
import Button from '@/components/ui/Button'

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getProducts()
      .then((res) => setProducts(res))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Productos</h2>
        <Button onClick={() => alert('Crear producto')}>Nuevo</Button>
      </div>

      {loading ? (
        <div>Cargando...</div>
      ) : (
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.codigo}</td>
                <td>{p.nombre}</td>
                <td>{p.precioVenta}</td>
                <td>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ProductList
