import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { CustomerData } from '@/hooks/useGoogleSheetsData';

interface RevenueChartProps {
  data: CustomerData[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  // Process data for revenue trends by month
  const revenueByMonth = data.reduce((acc, item) => {
    const month = item.billingPeriod;
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += item.totalAmount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(revenueByMonth).map(([month, revenue]) => ({
    month,
    revenue,
    formatted: `₹${revenue.toLocaleString()}`
  })).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 border border-primary/50">
          <p className="text-primary font-semibold">{label}</p>
          <p className="text-neon-cyan">
            Revenue: ₹{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-primary neon-text">Revenue Trends</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-neon-cyan animate-pulse-neon"></div>
          <span className="text-sm text-muted-foreground">Live Data</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--neon-cyan))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--neon-cyan))" stopOpacity={0.1}/>
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
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--neon-cyan))"
            strokeWidth={2}
            fill="url(#revenueGradient)"
            activeDot={{ 
              r: 6, 
              fill: "hsl(var(--neon-cyan))",
              stroke: "hsl(var(--background))",
              strokeWidth: 2
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};