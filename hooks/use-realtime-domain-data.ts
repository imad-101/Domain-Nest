import { useState, useEffect, useCallback } from 'react';
import { DomainHealthData, RealtimeDomainData } from '@/types/domain-realtime';

export function useRealtimeDomainData(domainId: string) {
  const [data, setData] = useState<RealtimeDomainData>({
    isLoading: true,
    healthData: null,
    error: null,
  });

  const fetchHealthData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch(`/api/domains/${domainId}/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const healthData: DomainHealthData = await response.json();
      
      setData({
        isLoading: false,
        healthData,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching domain health data:', error);
      setData({
        isLoading: false,
        healthData: null,
        error: error instanceof Error ? error.message : 'Failed to fetch domain data',
      });
    }
  }, [domainId]);

  const refreshData = useCallback(() => {
    fetchHealthData();
  }, [fetchHealthData]);

  useEffect(() => {
    fetchHealthData();
  }, [fetchHealthData]);

  return {
    ...data,
    refreshData,
  };
}
