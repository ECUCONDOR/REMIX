export default function Servicios() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Nuestros Servicios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Compra y Venta</h2>
          <p className="text-gray-600">
            Facilitamos la compra y venta de vehículos con un proceso seguro y transparente.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Financiamiento</h2>
          <p className="text-gray-600">
            Ofrecemos opciones de financiamiento flexibles para la adquisición de vehículos.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Asesoría Legal</h2>
          <p className="text-gray-600">
            Brindamos asesoría legal completa para todas las transacciones.
          </p>
        </div>
      </div>
    </div>
  );
}
