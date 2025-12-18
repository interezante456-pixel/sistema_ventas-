import React from 'react'
import { render, screen } from '@testing-library/react'
import ProductList from '../components/ProductList'

test('renders products heading', () => {
  render(<ProductList />)
  expect(screen.getByText(/Productos/i)).toBeInTheDocument()
})
