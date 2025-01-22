export default function Tasas() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tasas de Cambio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">USD/ARS</h2>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Dólar/Peso</span>
            <span className="text-2xl font-bold text-green-600">$---</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">BRL/ARS</h2>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Real/Peso</span>
            <span className="text-2xl font-bold text-green-600">$---</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">BTC/USD</h2>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Bitcoin/USD</span>
            <span className="text-2xl font-bold text-green-600">$---</span>
          </div>
        </div>
      </div>
    </div>
  );
}
