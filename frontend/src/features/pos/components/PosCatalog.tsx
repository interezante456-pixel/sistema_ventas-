import { Search, Package } from "lucide-react";

interface PosCatalogProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategory: number | null;
    setSelectedCategory: (cat: number | null) => void;
    categories: any[];
    loading: boolean;
    products: any[];
    onAddToCart: (product: any) => void;
}

export const PosCatalog = ({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categories,
    loading,
    products,
    onAddToCart
}: PosCatalogProps) => {
    return (
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden order-2 md:order-1">
            {/* Header Filtros */}
            <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        className="pl-10 w-full border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>
                <select
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none"
                    value={selectedCategory || ""}
                    onChange={(e) =>
                        setSelectedCategory(
                            e.target.value ? Number(e.target.value) : null
                        )
                    }
                >
                    <option value="">Todas las Categorías</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {/* Grilla Productos */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
                {loading ? (
                    <div className="flex justify-center items-center h-full text-gray-400">
                        Cargando...
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Package size={48} className="mb-2 opacity-50" />
                        <p>No se encontraron productos</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => onAddToCart(product)}
                                disabled={product.stock <= 0}
                                className={`group flex flex-col bg-white rounded-xl shadow-sm border hover:shadow-md transition-all overflow-hidden text-left relative ${product.stock <= 0
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:border-blue-400"
                                    }`}
                            >
                                {/* Stock Badge */}
                                <span
                                    className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded-full z-10 ${product.stock <= 5
                                            ? "bg-red-100 text-red-600"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    Stock: {product.stock}
                                </span>

                                {/* Imagen */}
                                <div className="aspect-square bg-gray-50 w-full relative">
                                    {product.imagenUrl ? (
                                        <img
                                            src={product.imagenUrl}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Package size={32} />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-3">
                                    <h3 className="font-medium text-gray-800 text-sm line-clamp-2 min-h-[40px] leading-tight">
                                        {product.nombre}
                                    </h3>
                                    <p className="text-blue-600 font-bold mt-1">
                                        S/ {Number(product.precioVenta).toFixed(2)}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
