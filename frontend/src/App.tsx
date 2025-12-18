import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Router from '@/router'
import './App.css'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  )
}
