import React from 'react'

const ProductForm: React.FC = () => {
  return (
    <form className="p-4 max-w-md">
      <div className="mb-2">
        <label className="block">Nombre</label>
        <input className="w-full border rounded p-2" />
      </div>
      <div className="mb-2">
        <label className="block">Precio</label>
        <input className="w-full border rounded p-2" />
      </div>
      <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
    </form>
  )
}

export default ProductForm
