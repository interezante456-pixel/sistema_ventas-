export const DashboardPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm font-medium uppercase">Ventas de Hoy</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">S/ 0.00</p>
      </div>
      {/* Puedes agregar más tarjetas aquí */}
    </div>
  );
};