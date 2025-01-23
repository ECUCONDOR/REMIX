import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { firebaseAuth } from "~/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";

interface ExchangeRates {
  usd_to_peso: string;
  real_to_peso: string;
  peso_to_real: string;
  real_to_usd: string;
  btc_to_usd: string;
}

export default function Index() {
  const [ratesTyped, setRatesTyped] = useState<ExchangeRates>({
    usd_to_peso: "0.00",
    real_to_peso: "0.00",
    peso_to_real: "0.00",
    real_to_usd: "0.00",
    btc_to_usd: "0.00"
  });
  const [lastUpdate, setLastUpdate] = useState<string>("--:--");
  const [firebaseStatus, setFirebaseStatus] = useState<string>("Verificando conexión...");

  useEffect(() => {
    // Verificar conexión con Firebase
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setFirebaseStatus(user ? `Conectado como: ${user.email}` : "Firebase conectado (no hay sesión)");
    }, (error) => {
      setFirebaseStatus(`Error de conexión: ${error.message}`);
    });

    // Simulación de actualización de tasas
    const mockRates = {
      usd_to_peso: "823.50",
      real_to_peso: "167.80",
      peso_to_real: "0.006",
      real_to_usd: "4.91",
      btc_to_usd: "41,235.00"
    };
    setRatesTyped(mockRates);
    setLastUpdate(new Date().toLocaleTimeString());

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent_70%)] pointer-events-none"></div>
      
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-white via-blue-400 to-white bg-clip-text text-transparent">
              ECUCONDOR
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              La plataforma más segura para tus transacciones internacionales entre Argentina, Brasil y Ecuador
            </p>
            <p className="text-sm text-blue-400 mb-8">
              {firebaseStatus}
            </p>
            <div className="flex justify-center">
              <input
                type="email"
                placeholder="Ingresa tu correo electrónico"
                className="w-full max-w-md px-4 py-3 rounded-l-lg bg-gray-800/50 text-white border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)]"
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-r-lg transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                Comenzar Ahora
              </button>
            </div>
          </div>

          {/* Exchange Rates Section */}
          <div className="mt-16 bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 relative group hover:border-blue-500/50 transition-colors">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 blur-sm group-hover:via-blue-500/20 transition-all"></div>
            <div className="relative">
              <h2 className="text-2xl font-semibold text-white mb-6">Tasas de Cambio en Vivo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <RateCard title="Dólares a Pesos" value={ratesTyped.usd_to_peso} icon="$" />
                <RateCard title="Reales a Pesos" value={ratesTyped.real_to_peso} icon="R$" />
                <RateCard title="Pesos a Reales" value={ratesTyped.peso_to_real} icon="$" />
                <RateCard title="Reales a Dólares" value={ratesTyped.real_to_usd} icon="$" />
                <RateCard title="Bitcoin a Dólares" value={ratesTyped.btc_to_usd} icon="₿" />
              </div>
              <p className="text-gray-400 text-sm mt-4 text-right">
                Última actualización: {lastUpdate}
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🔒"
              title="Seguridad Garantizada"
              description="Operaciones protegidas con los más altos estándares de seguridad bancaria"
            />
            <FeatureCard
              icon="⚡"
              title="Transacciones Rápidas"
              description="Transferencias procesadas en minutos, no en días"
            />
            <FeatureCard
              icon="💰"
              title="Mejores Tasas"
              description="Tasas competitivas y transparentes en todas las operaciones"
            />
          </div>
        </div>
      </main>

      <footer className="relative bg-gray-900/80 text-white p-8 mt-8 border-t border-gray-800 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Sobre Nosotros</h3>
              <p className="text-gray-400 text-sm">
                ECUCONDOR S.A.S es una empresa de transacciones internacionales seguras y eficientes.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/servicios" className="hover:text-blue-400">Servicios</Link></li>
                <li><Link to="/tasas" className="hover:text-blue-400">Tasas</Link></li>
                <li><Link to="/soporte" className="hover:text-blue-400">Soporte</Link></li>
                <li><Link to="/politicas" className="hover:text-blue-400">Términos y Condiciones</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">¿Necesitas Ayuda?</h3>
              <p className="text-gray-400 text-sm mb-2">
                Comunícate con nosotros a través de WhatsApp para obtener soporte personalizado.
              </p>
              <a 
                href="https://wa.me/5491166599559" 
                className="text-blue-400 hover:text-blue-300 text-sm"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chatear por WhatsApp"
              >
                Chatea con nosotros
              </a>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a 
                    href="mailto:Ecucondor@gmail.com"
                    className="hover:text-blue-400"
                    aria-label="Enviar correo a Ecucondor"
                  >
                    Ecucondor@gmail.com
                  </a>
                </li>
                <li>
                  <a 
                    href="tel:+5491166599559"
                    className="hover:text-blue-400"
                    aria-label="Llamar a Ecucondor"
                  >
                    +54 (911) 6659-9559
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p> 2024 ECUCONDOR S.A.S. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function RateCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 hover:border-blue-500/50 transition-all hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] group">
      <div className="flex items-center justify-between relative">
        <span className="text-gray-400 group-hover:text-gray-300 transition-colors">{title}</span>
        <span className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{icon} {value}</span>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] group relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative">
        <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">{icon}</span>
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
        <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{description}</p>
      </div>
    </div>
  );
}