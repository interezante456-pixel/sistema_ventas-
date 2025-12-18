import { useState } from 'react'
import { createProduct } from '../services/product.service'
import { Product } from '../types'

export function useCreateProduct() {
  const [loading, setLoading] = useState(false)

  async function create(payload: Partial<Product>) {
    setLoading(true)
    try {
      const res = await createProduct(payload)
      return res
    } finally {
      setLoading(false)
    }
  }

  return { create, loading }
}
