import React, { useState } from 'react';

/**
 * Componente Table reutilizable con ordenamiento
 */
function SortableTable({ columns, data, emptyMessage = 'No hay datos disponibles' }) {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Manejar valores anidados
      const column = columns.find(col => col.key === sortField);
      if (column?.valueGetter) {
        aVal = column.valueGetter(a);
        bVal = column.valueGetter(b);
      }

      // Manejar strings
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      // Manejar números
      if (typeof aVal === 'number') {
        // ya están listos
      } else if (!isNaN(parseFloat(aVal))) {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection, columns]);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  padding: '1rem',
                  textAlign: column.align || 'left',
                  fontSize: '0.875rem',
                  color: '#718096',
                  fontWeight: '600',
                  cursor: column.sortable !== false ? 'pointer' : 'default'
                }}
                onClick={() => column.sortable !== false && handleSort(column.key)}
              >
                {column.header}
                {column.sortable !== false && sortField === column.key && (
                  <span style={{ marginLeft: '0.5rem' }}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: '2rem', textAlign: 'center', color: '#718096' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, index) => (
              <tr key={row.id || index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    style={{
                      padding: '1rem',
                      textAlign: column.align || 'left',
                      color: '#2d3748'
                    }}
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SortableTable;

