import { Card } from '~/components/ui/card';
import { History } from 'lucide-react';

interface Transaction {
  id: string;
  created_at: string;
  type: 'exchange' | 'transfer';
  from_currency: string;
  to_currency: string;
  amount_from: number;
  amount_to: number;
  status: 'pending' | 'completed' | 'failed';
  rate: number;
}

interface DetailedTransactionHistoryProps {
  transactions: Transaction[];
}

export function DetailedTransactionHistory({ transactions }: DetailedTransactionHistoryProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card className="col-span-3 bg-blue-800/30 backdrop-blur-sm border-blue-700/50">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <History className="h-5 w-5 text-blue-200" />
          <h3 className="text-xl font-semibold text-white">Historial de Transacciones</h3>
        </div>
        <div className="space-y-4">
          {transactions.slice(0, 5).map((transaction) => (
            <div
              key={transaction.id}
              className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/30"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm text-blue-200">
                    {transaction.type === 'exchange' ? 'Cambio' : 'Transferencia'}
                  </span>
                  <p className="text-white font-medium">
                    {formatCurrency(transaction.amount_from, transaction.from_currency)} →{' '}
                    {formatCurrency(transaction.amount_to, transaction.to_currency)}
                  </p>
                </div>
                <span className={`text-sm capitalize ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>
              <div className="flex justify-between text-sm text-blue-300">
                <span>Tasa: {transaction.rate.toFixed(4)}</span>
                <span>{formatDate(transaction.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
