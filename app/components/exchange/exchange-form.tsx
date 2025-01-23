import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useState } from "react";
import { Card } from "~/components/ui/card";
import { BankInfo } from "./bank-info";
import { ClientInfo, ClientData } from "./client-info";
import { Checkbox } from "~/components/ui/checkbox";

interface ExchangeFormProps {
  amount: string;
  onAmountChange: (value: string) => void;
  fromCurrency: string;
  onFromCurrencyChange: (value: string) => void;
  toCurrency: string;
  onToCurrencyChange: (value: string) => void;
  onCalculate: () => void;
  isLoading?: boolean;
  rates: Record<string, number>;
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
}

export function ExchangeForm({
  amount,
  onAmountChange,
  fromCurrency,
  onFromCurrencyChange,
  toCurrency,
  onToCurrencyChange,
  onCalculate,
  isLoading = false,
  rates,
  onError,
  onSuccess,
}: ExchangeFormProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showClientInfo, setShowClientInfo] = useState(false);
  const [clientData, setClientData] = useState<ClientData | null>(null);

  const handleCalculate = () => {
    if (!amount) {
      onError("Por favor ingrese un monto");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      onError("El monto debe ser un número válido mayor a cero");
      return;
    }

    const rate = rates[`${fromCurrency}${toCurrency}`] || rates[`${toCurrency}${fromCurrency}`];
    if (!rate) {
      onError("Tasa de cambio no disponible");
      return;
    }

    let finalAmount = numAmount * rate;
    if (termsAccepted) {
      const commission = numAmount <= 15 ? 0.05 * 0.50 : 0.05;
      finalAmount = finalAmount * (1 - commission);
    }

    onSuccess(`${numAmount} ${fromCurrency} = ${finalAmount.toFixed(2)} ${toCurrency}`);
    setShowClientInfo(true);
  };

  const handleClientInfoSubmit = (data: ClientData) => {
    setClientData(data);
    onSuccess("Información del cliente guardada correctamente");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="amount">Monto</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="Ingrese el monto"
            className="bg-blue-900/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fromCurrency">De</Label>
            <Select value={fromCurrency} onValueChange={onFromCurrencyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione moneda" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="ARS">ARS</SelectItem>
                  <SelectItem value="BRL">BRL</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="toCurrency">A</Label>
            <Select value={toCurrency} onValueChange={onToCurrencyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione moneda" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="ARS">ARS</SelectItem>
                  <SelectItem value="BRL">BRL</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
          />
          <label
            htmlFor="terms"
          >
            Acepto los términos y condiciones
          </label>
        </div>

        <Button
          onClick={handleCalculate}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Calculando..." : "Calcular"}
        </Button>
      </div>

      <BankInfo currency={toCurrency as "USD" | "ARS" | "BRL"} />

      {showClientInfo && !clientData && (
        <ClientInfo onSubmit={handleClientInfoSubmit} />
      )}

      {clientData && (
        <Card className="p-6 bg-gray-800/50 backdrop-blur-lg border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Información Guardada</h3>
          <div className="space-y-2 text-gray-300">
            <p><strong>Nombre:</strong> {clientData.fullName}</p>
            <p><strong>Documento:</strong> {clientData.documentId}</p>
            <p><strong>Cuenta:</strong> {clientData.bankAccount}</p>
            <p><strong>Alias:</strong> {clientData.bankAlias}</p>
            {clientData.pixKey && <p><strong>PIX:</strong> {clientData.pixKey}</p>}
          </div>
        </Card>
      )}
    </div>
  );
}
