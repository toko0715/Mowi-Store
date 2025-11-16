import { useState } from 'react';

/**
 * Hook personalizado para manejar ordenamiento de tablas
 */
function useSort(defaultField = null) {
  const [sortField, setSortField] = useState(defaultField);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortData = (data, getValue) => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      let aVal = getValue ? getValue(a, sortField) : a[sortField];
      let bVal = getValue ? getValue(b, sortField) : b[sortField];

      // Manejar strings
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      // Manejar números
      if (typeof aVal !== 'number' && !isNaN(parseFloat(aVal))) {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  return { sortField, sortDirection, handleSort, sortData };
}

export default useSort;

