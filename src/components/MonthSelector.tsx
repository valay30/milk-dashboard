import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, addMonths, subMonths } from 'date-fns';

interface MonthSelectorProps {
  selectedMonth: Date | null;
  onMonthChange: (month: Date | null) => void;
  selectedYear?: number;
  onYearChange?: (year: number) => void;
}

export const MonthSelector = ({ 
  selectedMonth, 
  onMonthChange, 
  selectedYear = new Date().getFullYear(),
  onYearChange 
}: MonthSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(selectedYear);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleMonthSelect = (monthIndex: number) => {
    const selectedDate = new Date(currentYear, monthIndex, 1);
    onMonthChange(selectedDate);
    setIsOpen(false);
  };

  const clearSelection = () => {
    onMonthChange(null);
    const currentYearNow = new Date().getFullYear();
    setCurrentYear(currentYearNow);
    onYearChange?.(currentYearNow);
    setIsOpen(false);
  };

  const clearAllFilters = () => {
    onMonthChange(null);
    onYearChange?.(null); // Set year to null for lifetime data
    setIsOpen(false);
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    const newYear = direction === 'prev' ? currentYear - 1 : currentYear + 1;
    setCurrentYear(newYear);
    onYearChange?.(newYear);
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="glass-card neon-border hover:bg-primary/10 text-foreground"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {selectedMonth ? format(selectedMonth, 'MMMM yyyy') : selectedYear ? `All of ${currentYear}` : 'Lifetime Data'}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 glass-card border-border/50" align="start">
          <div className="p-3 border-b border-border/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Select Month</span>
              <div className="flex items-center space-x-2">
                {selectedMonth && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSelection}
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear Month
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Lifetime
                </Button>
              </div>
            </div>
          </div>
          
          {/* Year Navigation */}
          <div className="flex items-center justify-between p-3 border-b border-border/30">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateYear('prev')}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-lg font-semibold text-primary neon-text">
              {currentYear}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateYear('next')}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Month Grid */}
          <div className="p-3">
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => {
                const isSelected = selectedMonth && 
                  selectedMonth.getMonth() === index && 
                  selectedMonth.getFullYear() === currentYear;
                
                return (
                  <Button
                    key={month}
                    variant="ghost"
                    onClick={() => handleMonthSelect(index)}
                    className={`h-10 text-sm transition-all duration-200 ${
                      isSelected 
                        ? 'bg-primary/20 text-primary neon-border' 
                        : 'hover:bg-primary/10 hover:text-primary text-muted-foreground'
                    }`}
                  >
                    {month.slice(0, 3)}
                  </Button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};