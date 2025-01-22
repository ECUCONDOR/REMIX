export default function Soporte() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Centro de Soporte</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            <details className="cursor-pointer">
              <summary className="text-lg font-medium text-gray-700 hover:text-gray-900">
                ¿Cómo funciona el proceso de compra?
              </summary>
              <p className="mt-2 text-gray-600 pl-4">
                El proceso de compra es simple y seguro. Seleccione el vehículo de su interés,
                contacte al vendedor y coordine la inspección y prueba del vehículo.
              </p>
            </details>
            <details className="cursor-pointer">
              <summary className="text-lg font-medium text-gray-700 hover:text-gray-900">
                ¿Qué documentos necesito?
              </summary>
              <p className="mt-2 text-gray-600 pl-4">
                Se requiere DNI o pasaporte vigente, comprobante de domicilio y documentación
                que acredite ingresos en caso de solicitar financiamiento.
              </p>
            </details>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Contacto Directo</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
