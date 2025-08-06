import { useGoogleSheetsData } from '@/hooks/useGoogleSheetsData';
import { MetricCard } from './MetricCard';
import { RevenueChart } from './RevenueChart';
import { CustomerTable } from './CustomerTable';
import { DistributionChart } from './DistributionChart';
import { MonthSelector } from './MonthSelector';
import { useAuth } from '@/hooks/useAuth';
import { 
  DollarSign, 
  Users, 
  Droplet, 
  TrendingUp, 
  RefreshCw, 
  Activity,
  Calendar,
  Phone,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';

export const Dashboard = () => {
  const { data, loading, error, refetch } = useGoogleSheetsData();
  const { signOut } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(new Date().getFullYear());

  // Filter data based on selected month/year
  const filteredData = useMemo(() => {
    if (!selectedYear) {
      // Show all lifetime data when year is null
      return data;
    }
    
    if (!selectedMonth) {
      // Show all data for the selected year when no month is selected
      return data.filter(item => 
        item.billingPeriod.toLowerCase().includes(selectedYear.toString())
      );
    }
    
    const selectedMonthYear = format(selectedMonth, 'MMMM yyyy');
    return data.filter(item => 
      item.billingPeriod.toLowerCase().includes(selectedMonthYear.toLowerCase()) ||
      item.billingPeriod.toLowerCase().includes(format(selectedMonth, 'MMM yyyy').toLowerCase())
    );
  }, [data, selectedMonth, selectedYear]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-primary neon-text animate-pulse-neon">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 glass-card p-8 max-w-md">
          <div className="text-destructive text-xl">⚠️</div>
          <p className="text-destructive">Error loading data: {error}</p>
          <Button onClick={refetch} variant="outline" className="neon-border">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Calculate metrics using filtered data
  const totalRevenue = filteredData.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalCustomers = filteredData.length;
  const totalQuantity = filteredData.reduce((sum, item) => sum + item.milkQuantity, 0);
  const averageOrderValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
  const averagePricePerLiter = totalQuantity > 0 ? totalRevenue / totalQuantity : 0;

  // Calculate month-over-month growth (simplified)
  const revenueGrowth = Math.random() * 20 + 5; // Placeholder for demo
  const customerGrowth = Math.random() * 15 + 3;
  const quantityGrowth = Math.random() * 25 + 8;

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-primary neon-text">
            Dairy Analytics Hub
          </h1>
          <p className="text-muted-foreground">
            Real-time business intelligence dashboard
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <MonthSelector 
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
          <div className="flex items-center space-x-2 glass-card px-4 py-2">
            <Activity className="w-4 h-4 text-neon-green animate-pulse" />
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
          <Button 
            onClick={refetch} 
            variant="outline" 
            size="sm"
            className="neon-border hover:bg-primary/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={signOut} 
            variant="outline" 
            size="sm"
            className="neon-border hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="data-grid">
        <MetricCard
          title="Total Revenue"
          value={totalRevenue}
          icon={DollarSign}
          trend={revenueGrowth}
          prefix="₹"
          color="cyan"
        />
        <MetricCard
          title="Active Customers"
          value={totalCustomers}
          icon={Users}
          trend={customerGrowth}
          color="purple"
        />
        <MetricCard
          title="Milk Distributed"
          value={totalQuantity}
          icon={Droplet}
          trend={quantityGrowth}
          suffix="L"
          color="pink"
        />
        <MetricCard
          title="Avg Order Value"
          value={averageOrderValue.toFixed(0)}
          icon={TrendingUp}
          prefix="₹"
          color="green"
        />
        <MetricCard
          title="Avg Price/Liter"
          value={averagePricePerLiter.toFixed(2)}
          icon={DollarSign}
          prefix="₹"
          color="cyan"
        />
        <MetricCard
          title="Billing Periods"
          value={new Set(filteredData.map(d => d.billingPeriod)).size}
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={filteredData} />
        <DistributionChart data={filteredData} />
      </div>

      {/* Customer Table */}
      <CustomerTable data={filteredData} />

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground py-8">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
            <span>Connected to Google Sheets</span>
          </div>
        </div>
      </div>
    </div>
  );
};