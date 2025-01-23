import { Card } from "~/components/ui/card";

interface TestimonialCardProps {
  name: string;
  location: string;
  message: string;
  imageUrl?: string;
}

export function TestimonialCard({ name, location, message, imageUrl }: TestimonialCardProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-md border border-gray-700/50 p-6 shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center mb-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-600/30 flex items-center justify-center">
            <span className="text-blue-100 text-lg font-semibold">{name[0]}</span>
          </div>
        )}
        <div className="ml-4">
          <h4 className="text-lg font-semibold text-blue-100">{name}</h4>
          <p className="text-sm text-gray-400">{location}</p>
        </div>
      </div>
      <p className="text-gray-300 italic">"{message}"</p>
    </Card>
  );
}
