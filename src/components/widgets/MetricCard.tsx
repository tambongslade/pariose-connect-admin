import { Card } from '../ui/Card';
import { clsx } from 'clsx';
import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  iconBgColor: string;
  iconColor: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconBgColor,
  iconColor,
}: MetricCardProps) {
  const changeColors = {
    increase: 'text-green-600',
    decrease: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {change && (
            <p className={clsx('text-sm font-medium', changeColors[changeType])}>
              {change}
            </p>
          )}
        </div>
        <div
          className={clsx(
            'p-3 rounded-lg',
            iconBgColor
          )}
        >
          <Icon className={clsx('w-6 h-6', iconColor)} />
        </div>
      </div>
    </Card>
  );
}
