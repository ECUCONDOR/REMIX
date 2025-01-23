import { TestimonialCard } from "./testimonial-card";

const testimonials = [
  {
    name: "Carlos Rodríguez",
    location: "Buenos Aires, Argentina",
    message: "Excelente servicio. La transferencia fue rápida y segura. Los recomiendo totalmente para cambios de divisas.",
  },
  {
    name: "María Silva",
    location: "São Paulo, Brasil",
    message: "Muito bom! Consegui fazer a transferência em reais sem problemas. O atendimento foi ótimo.",
  },
  {
    name: "Juan Pérez",
    location: "Guayaquil, Ecuador",
    message: "El mejor servicio de cambio que he usado. Las tasas son muy competitivas y el proceso es muy transparente.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob-slow"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob-slow animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-100 mb-12">
          Lo que dicen nuestros clientes
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              location={testimonial.location}
              message={testimonial.message}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
