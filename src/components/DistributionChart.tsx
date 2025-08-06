import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CustomerData } from '@/hooks/useGoogleSheetsData';

interface DistributionChartProps {
  data: CustomerData[];
}

export const DistributionChart = ({ data }: DistributionChartProps) => {
  // Calculate quantity distribution by month
  const quantityByMonth = data.reduce((acc, item) => {
    const month = item.billingPeriod;
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += item.milkQuantity;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(quantityByMonth).map(([month, quantity]) => ({
    month,
    quantity,
    formatted: `${quantity}L`
  }));

  const COLORS = [
    'hsl(var(--neon-cyan))',
    'hsl(var(--neon-purple))',
    'hsl(var(--neon-pink))',
    'hsl(var(--neon-green))',
    'hsl(var(--cyber-blue))',
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 border border-primary/50">
          <p className="text-primary font-semibold">{label}</p>
          <p className="text-neon-cyan">
            Quantity: {payload[0].value}L
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-primary neon-text">Milk Distribution</h3>
        <div className="text-sm text-muted-foreground">
          Total: {data.reduce((sum, item) => sum + item.milkQuantity, 0)}L
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <defs>
            <linearGradient id="quantityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--neon-purple))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--neon-purple))" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => `${value}L`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="quantity"
            fill="url(#quantityGradient)"
            radius={[4, 4, 0, 0]}
            stroke="hsl(var(--neon-purple))"
            strokeWidth={1}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};