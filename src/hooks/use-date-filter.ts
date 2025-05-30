
import { useState, useEffect } from 'react';
import { isAfter, isBefore, format } from 'date-fns';

export const useDateFilter = <T extends { createdAt: Date | string; updatedAt?: Date | string }>(
  items: T[],
  dateField: 'createdAt' | 'updatedAt' = 'createdAt'
) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [filteredItems, setFilteredItems] = useState<T[]>(items);

  useEffect(() => {
    let filtered = [...items];
    
    if (startDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item[dateField] || item.createdAt);
        return isAfter(itemDate, startDate) || format(itemDate, 'yyyy-MM-dd') === format(startDate, 'yyyy-MM-dd');
      });
    }
    
    if (endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item[dateField] || item.createdAt);
        return isBefore(itemDate, endDate) || format(itemDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd');
      });
    }
    
    setFilteredItems(filtered);
  }, [startDate, endDate, items, dateField]);

  const clearDateFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    filteredItems,
    clearDateFilters
  };
};
