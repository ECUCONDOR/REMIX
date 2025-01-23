import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useCurrencyRates } from "~/hooks/useCurrencyRates";
import { Card } from "~/components/ui/card";
import { AlertCircle, ArrowRight, CheckCircle, Zap, Loader2, MessageCircle, Mail, Phone } from "lucide-react";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { firebaseAuth } from "~/lib/firebase/client";

export default function Index() {
  const { rates, lastUpdate, loading, error } = useCurrencyRates();
  const [firebaseStatus, setFirebaseStatus] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setFirebaseStatus(user ? "Firebase conectado" : "");
    });

    // Actualizar las tasas cada 30 segundos
    const interval = setInterval(() => {
      window.location.reload();
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1421] to-[#1a2a46] text-white relative overflow-hidden">
      {/* Efecto Parallax Sutil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent_70%)] opacity-50 transition-opacity duration-500"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(2,169,195,0.15),transparent_70%)] opacity-30 transition-opacity duration-500"></div>
      </div>

      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            {/* Título Animado */}
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200 animate-pulse">ECU<span className="text-white">CONDOR</span></span>
              <span className="block mt-3 text-2xl font-semibold text-gray-200 tracking-wider">Tu Puente Financiero Global</span>
            </h1>
            {/* Subtítulo con Iconos */}
            <p className="mt-6 text-lg text-gray-300 sm:text-xl max-w-2xl mx-auto">
              La plataforma más segura para tus transacciones internacionales entre Argentina, Brasil y Ecuador
            </p>
            <div className="mt-6 space-y-4">
              <p className="text-lg text-gray-300 sm:text-xl max-w-2xl mx-auto flex items-center justify-center gap-4">
                <CheckCircle className="text-green-400" size={20} />
                <span>Transacciones seguras, rápidas y confiables</span>
              </p>
              <p className="text-lg text-gray-300 sm:text-xl max-w-2xl mx-auto flex items-center justify-center gap-4">
                <Zap className="text-yellow-400" size={20} />
                <span>Las mejores tasas, actualizadas al instante</span>
              </p>
            </div>
          </div>

          {/* Tarjeta Principal con Efecto Neumorphism */}
          <div className="mt-16">
            <Card className="bg-blue-900/50 backdrop-blur-md border-2 border-blue-700/75  shadow-lg transition-shadow hover:shadow-xl p-8 relative overflow-hidden">
              {/* Efecto de Luz en Movimiento */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(0,145,255,0.3),transparent_60%)] animate-blob-slow pointer-events-none"></div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold text-blue-100 tracking-wide">Tasas de Cambio en Tiempo Real</h2>
                <p className="text-sm text-gray-300 mt-2">Última actualización: {lastUpdate}</p>
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-800/70 border border-red-700 mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                <RateCard title="USD/ARS" value={rates.USDARS} icon="$" />
                <RateCard title="USD/BRL" value={rates.USDBRL} icon="R$" />
                <RateCard title="ARS/BRL" value={rates.ARSBRL} icon="$" />
              </div>

              {/* Botón con Icono */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link
                  to="/exchange"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  onClick={(e) => {
                    const user = firebaseAuth.currentUser;
                    if (!user) {
                      e.preventDefault();
                      const redirectPath = encodeURIComponent("/exchange");
                      navigate(`/login?redirectTo=${redirectPath}`);
                    }
                  }}
                >
                  Iniciar Transacción
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </Card>
          </div>

          {/* Sección de Características con Animaciones Sutiles */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              icon="🔒"
              title="Máxima Seguridad"
              description="Protegemos tus transacciones con tecnología de punta."
              className="transition-transform hover:scale-105"
            />
            <FeatureCard
              icon="⚡"
              title="Rapidez Inigualable"
              description="Procesos optimizados para transacciones instantáneas."
              className="transition-transform hover:scale-105"
            />
            <FeatureCard
              icon="📈"
              title="Tasas Competitivas"
              description="Las mejores tasas del mercado, siempre actualizadas."
              className="transition-transform hover:scale-105"
            />
          </div>

          {/* Testimonios */}
          <div className="mt-20">
            <h2 className="text-3xl font-semibold text-center text-blue-100 mb-8">Lo que Dicen Nuestros Clientes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                name="Maria G."
                location="Buenos Aires, Argentina"
                message="ECUCONDOR me ha simplificado la vida. Cambio divisas de forma rápida y segura, ¡y siempre con las mejores tasas!"
              />
              <TestimonialCard
                name="João S."
                location="São Paulo, Brasil"
                message="Excelente servicio. Rápido, confiable y con una atención al cliente impecable. ¡Lo recomiendo!"
              />
              <TestimonialCard
                name="Carlos M."
                location="Miami, USA"
                message="Como extranjero, necesito un servicio de cambio de divisas confiable. ECUCONDOR cumple con creces."
              />
            </div>
          </div>

          <div className="mt-20 text-center text-gray-500">
            <p className="text-sm">{firebaseStatus}</p>
          </div>
        </div>
      </main>

      {/* Footer Moderno */}
      <footer className="relative bg-gray-900/90 text-white py-16 mt-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-6">Sobre ECUCONDOR</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                ECUCONDOR S.A.S es líder en transacciones internacionales. Ofrecemos soluciones financieras seguras, eficientes y adaptadas a tus necesidades.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-6">Enlaces Rápidos</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link to="/servicios" className="hover:text-blue-400 transition-colors">Nuestros Servicios</Link></li>
                <li><Link to="/tasas" className="hover:text-blue-400 transition-colors">Ver Tasas Actuales</Link></li>
                <li><Link to="/soporte" className="hover:text-blue-400 transition-colors">Soporte al Cliente</Link></li>
                <li><Link to="/politicas" className="hover:text-blue-400 transition-colors">Términos y Condiciones</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-6">Ayuda Personalizada</h3>
              <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                ¿Tienes dudas? Contáctanos por WhatsApp para una atención inmediata y personalizada.
              </p>
              <a
                href="https://wa.me/5491166599559"
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chatear por WhatsApp"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chatea con Nosotros
              </a>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-6">Contacto Directo</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <a
                    href="mailto:Ecucondor@gmail.com"
                    className="hover:text-blue-400 transition-colors flex items-center"
                    aria-label="Enviar correo a Ecucondor"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Ecucondor@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+5491166599559"
                    className="hover:text-blue-400 transition-colors flex items-center"
                    aria-label="Llamar a Ecucondor"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    +54 (911) 6659-9559
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p> 2024 ECUCONDOR S.A.S. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function RateCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-gray-800/20 backdrop-blur-md rounded-lg p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all shadow-md group relative hover:shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-gray-400 transition-colors group-hover:text-gray-300">{title}</span>
        <span className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">{icon} {value}</span>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, className }: { icon: string; title: string; description: string; className?: string }) {
  return (
    <div className={`bg-blue-800/10 backdrop-blur-md border-2 border-blue-700/75 rounded-lg p-6 text-center shadow-md hover:shadow-xl transition-all ${className}`}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-blue-100">{title}</h3>
      <p className="mt-2 text-blue-200">{description}</p>
    </div>
  );
}

// Componente TestimonialCard con estilos mejorados
function TestimonialCard({ name, location, message }: { name: string; location: string; message: string }) {
  return (
    <Card className="bg-blue-900/20 backdrop-blur-md border border-blue-700/50 p-6 shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-800/50 border border-blue-700/50 flex items-center justify-center">
          {/* Puedes reemplazar esto con una imagen de perfil si tienes una URL */}
          <span className="text-blue-200 text-lg font-semibold">{name[0]}</span>
        </div>
        <div className="ml-4">
          <h4 className="text-lg font-semibold text-blue-100">{name}</h4>
          <p className="text-sm text-gray-400">{location}</p>
        </div>
      </div>
      <p className="text-gray-300 italic leading-relaxed">"{message}"</p>
    </Card>
  );
}