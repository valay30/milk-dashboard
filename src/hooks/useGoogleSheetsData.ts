import { useState, useEffect } from 'react';

export interface CustomerData {
  customerName: string;
  mobileNumber: string;
  billingPeriod: string;
  milkQuantity: number;
  pricePerLiter: number;
  totalAmount: number;
}

export const useGoogleSheetsData = () => {
  const [data, setData] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        'https://docs.google.com/spreadsheets/d/1701Z2SGGkWaFwxTZBOnaZBbeZqzo9mQ6Ubc1XhqYfsQ/export?format=csv'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const csvText = await response.text();
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const parsedData: CustomerData[] = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        return {
          customerName: values[0] || '',
          mobileNumber: values[1] || '',
          billingPeriod: values[2] || '',
          milkQuantity: parseFloat(values[3]) || 0,
          pricePerLiter: parseFloat(values[4]) || 0,
          totalAmount: parseFloat(values[5]) || 0,
        };
      }).filter(item => item.customerName); // Filter out empty rows
      
      setData(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching Google Sheets data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};