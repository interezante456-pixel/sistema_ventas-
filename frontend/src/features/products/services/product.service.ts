import api from '@/config/api'
import { Product } from '../types'

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await api.get('/products')
    return res.data || []
  } catch (e) {
    console.error('getProducts', e)
    return []
  }
}

export async function createProduct(payload: Partial<Product>): Promise<Product | null> {
  try {
    const res = await api.post('/products', payload)
    return res.data
  } catch (e) {
    console.error('createProduct', e)
    return null
  }
}
