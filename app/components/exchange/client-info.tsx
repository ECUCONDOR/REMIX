import { useState } from "react";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { UserIcon, CreditCardIcon, BankIcon } from "~/components/icons";

interface ClientInfoProps {
  onSubmit: (data: ClientData) => void;
}

export interface ClientData {
  fullName: string;
  documentId: string;
  bankAccount: string;
  bankAlias: string;
  pixKey?: string;
}

export function ClientInfo({ onSubmit }: ClientInfoProps) {
  const [formData, setFormData] = useState<ClientData>({
    fullName: "",
    documentId: "",
    bankAccount: "",
    bankAlias: "",
    pixKey: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card className="p-6 bg-gray-800/50 backdrop-blur-lg border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4">Información del Cliente</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName" className="text-gray-200 flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            Nombre Completo
          </Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="bg-gray-700/50 border-gray-600 text-white mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="documentId" className="text-gray-200 flex items-center gap-2">
            <CreditCardIcon className="w-4 h-4" />
            DNI/Documento de Identidad
          </Label>
          <Input
            id="documentId"
            name="documentId"
            value={formData.documentId}
            onChange={handleChange}
            className="bg-gray-700/50 border-gray-600 text-white mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="bankAccount" className="text-gray-200 flex items-center gap-2">
            <BankIcon className="w-4 h-4" />
            Número de Cuenta
          </Label>
          <Input
            id="bankAccount"
            name="bankAccount"
            value={formData.bankAccount}
            onChange={handleChange}
            className="bg-gray-700/50 border-gray-600 text-white mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="bankAlias" className="text-gray-200 flex items-center gap-2">
            <BankIcon className="w-4 h-4" />
            Alias/CBU/CVU
          </Label>
          <Input
            id="bankAlias"
            name="bankAlias"
            value={formData.bankAlias}
            onChange={handleChange}
            className="bg-gray-700/50 border-gray-600 text-white mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="pixKey" className="text-gray-200 flex items-center gap-2">
            <BankIcon className="w-4 h-4" />
            Clave PIX (opcional)
          </Label>
          <Input
            id="pixKey"
            name="pixKey"
            value={formData.pixKey}
            onChange={handleChange}
            className="bg-gray-700/50 border-gray-600 text-white mt-1"
            placeholder="Solo para transacciones en BRL"
          />
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Guardar Información
        </Button>
      </form>
    </Card>
  );
}
