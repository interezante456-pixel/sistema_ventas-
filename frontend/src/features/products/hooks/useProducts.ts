import { useEffect, useState } from 'react'
import { Product } from '../types'
import { getProducts } from '../services/product.service'

export function useProducts() {
  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts().then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [])

  return { data, loading }
}
