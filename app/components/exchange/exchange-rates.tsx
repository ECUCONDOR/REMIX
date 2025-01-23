interface ExchangeRatesProps {
  rates: {
    USDARS: string;
    USDBRL: string;
    ARSBRL: string;
  };
}

export function ExchangeRates({ rates }: ExchangeRatesProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-lg font-semibold text-blue-200">
      <div>1 USD = {rates.USDARS} ARS</div>
      <div>1 USD = {rates.USDBRL} BRL</div>
      <div>1 ARS = {rates.ARSBRL} BRL</div>
    </div>
  );
}
