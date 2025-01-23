import { Card } from './card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  content?: React.ReactNode;
}

export function StatCard({ title, value, icon, trend, content }: StatCardProps) {
  return (
    <Card variant="blur">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="bg-blue-900/50 p-3 rounded-lg text-blue-200">
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${
              trend.value >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {trend.value >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-blue-200">{title}</p>
          {!content && <p className="text-2xl font-semibold text-white mt-1">{value}</p>}
          {content}
        </div>
      </div>
    </Card>
  );
}
