import { Card } from "~/components/ui/card";
import { 
  BankIcon,
  CreditCardIcon,
  MailIcon,
  UserIcon,
  FileTextIcon,
  ClockIcon
} from "~/components/icons";

interface BankInfoProps {
  currency: "USD" | "ARS" | "BRL";
}

export function BankInfo({ currency }: BankInfoProps) {
  if (currency === "USD") {
    return (
      <Card className="p-6 bg-gray-800/50 backdrop-blur-lg border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Información Bancaria para Pago en USD</h3>
        <div className="space-y-3 text-gray-300">
          <div className="flex items-center gap-2">
            <BankIcon className="w-5 h-5 text-blue-400" />
            <span>Banco: Produbanco</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCardIcon className="w-5 h-5 text-blue-400" />
            <span>Tipo de Cuenta: Pro Pyme</span>
          </div>
          <div className="flex items-center gap-2">
            <FileTextIcon className="w-5 h-5 text-blue-400" />
            <span>Número de Cuenta: 27059070809</span>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-400" />
            <span>Nombre: Ecucondor S.A.S. Sociedad De Beneficio E Interés Colectivo</span>
          </div>
          <div className="flex items-center gap-2">
            <FileTextIcon className="w-5 h-5 text-blue-400" />
            <span>RUC: 1391937000001</span>
          </div>
          <div className="flex items-center gap-2">
            <MailIcon className="w-5 h-5 text-blue-400" />
            <span>Correo: ecucondor@gmail.com</span>
          </div>
        </div>
      </Card>
    );
  }

  if (currency === "ARS") {
    return (
      <Card className="p-6 bg-gray-800/50 backdrop-blur-lg border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Información Bancaria para Pago en ARS</h3>
        <div className="space-y-3 text-gray-300">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-400" />
            <span>Nombre: Reina Mosquera</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCardIcon className="w-5 h-5 text-blue-400" />
            <span>CVU: 0000003100085925582280</span>
          </div>
          <div className="flex items-center gap-2">
            <FileTextIcon className="w-5 h-5 text-blue-400" />
            <span>Alias: reinasmb.</span>
          </div>
          <div className="flex items-center gap-2">
            <FileTextIcon className="w-5 h-5 text-blue-400" />
            <span>CUIT/CUIL: 20963144769</span>
          </div>
        </div>
      </Card>
    );
  }

  if (currency === "BRL") {
    return (
      <Card className="p-6 bg-gray-800/50 backdrop-blur-lg border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Información Bancaria para Pago en BRL</h3>
        <div className="space-y-3 text-gray-300">
          <p className="font-medium">Para recibir BRL:</p>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-yellow-400" />
            <span>Por favor, proporcione su información de PIX</span>
          </div>
          
          <div className="flex items-center gap-2">
            <CreditCardIcon className="w-5 h-5 text-blue-400" />
            <span>PIX: ecucondor@gmail.com</span>
          </div>
        </div>
      </Card>
    );
  }

  return null;
}
