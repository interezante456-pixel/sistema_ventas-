import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-full p-4 bg-gray-50">
      <nav className="flex flex-col gap-2">
        <Link to="/">Home</Link>
        <Link to="/products">Productos</Link>
      </nav>
    </aside>
  )
}

export default Sidebar
