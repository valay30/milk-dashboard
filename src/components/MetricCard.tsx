import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  suffix?: string;
  prefix?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
}

export const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  suffix = '', 
  prefix = '',
  color = 'cyan' 
}: MetricCardProps) => {
  const colorClasses = {
    cyan: 'text-neon-cyan',
    purple: 'text-neon-purple',
    pink: 'text-neon-pink',
    green: 'text-neon-green'
  };

  const glowClasses = {
    cyan: 'hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)]',
    purple: 'hover:shadow-[0_0_20px_hsl(var(--neon-purple)/0.5)]',
    pink: 'hover:shadow-[0_0_20px_hsl(var(--neon-pink)/0.5)]',
    green: 'hover:shadow-[0_0_20px_hsl(var(--neon-green)/0.5)]'
  };

  return (
    <div className={`metric-card group animate-slide-up ${glowClasses[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br from-${color === 'cyan' ? 'neon-cyan' : color === 'purple' ? 'neon-purple' : color === 'pink' ? 'neon-pink' : 'neon-green'}/20 to-transparent`}>
          <Icon className={`w-6 h-6 ${colorClasses[color]} group-hover:animate-pulse-neon`} />
        </div>
        {trend !== undefined && (
          <div className={`text-sm ${trend >= 0 ? 'text-neon-green' : 'text-destructive'}`}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
        <div className={`text-3xl font-bold ${colorClasses[color]} neon-text group-hover:animate-pulse-neon`}>
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
      </div>
      
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};