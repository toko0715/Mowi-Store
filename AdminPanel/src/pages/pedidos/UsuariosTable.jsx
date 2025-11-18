import React from 'react';
import Badge from '../../components/Badge';

/**
 * Componente de tabla de usuarios
 */
function UsuariosTable({ usuarios, onEdit, onDelete }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>
              ID
            </th>
            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>
              Nombre
            </th>
            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>
              Email
            </th>
            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>
              Rol
            </th>
            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>
              Estado
            </th>
            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#718096', fontWeight: '600' }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#718096' }}>
                No se encontraron usuarios
              </td>
            </tr>
          ) : (
            usuarios.map(usuario => {
              const nombre = usuario.nombre || usuario.name || '';
              const rol = usuario.rol || (usuario.is_admin || usuario.is_staff ? 'admin' : 'cliente');
              const activo = usuario.activo !== undefined ? usuario.activo : (usuario.is_active !== undefined ? usuario.is_active : true);
              
              return (
              <tr key={usuario.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem', fontWeight: '600', color: '#2d3748' }}>#{usuario.id}</td>
                <td style={{ padding: '1rem', fontWeight: '600', color: '#2d3748' }}>{nombre}</td>
                <td style={{ padding: '1rem', color: '#718096' }}>{usuario.email}</td>
                <td style={{ padding: '1rem' }}>
                  <Badge variant={rol === 'admin' ? 'info' : 'success'}>
                    {rol}
                  </Badge>
                </td>
                <td style={{ padding: '1rem' }}>
                  <Badge variant={activo ? 'success' : 'danger'}>
                    {activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => onEdit(usuario)}
                      style={{
                        padding: '0.5rem',
                        background: '#edf2f7',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      title="Editar usuario"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(usuario.id)}
                      style={{
                        padding: '0.5rem',
                        background: '#fed7d7',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      title="Eliminar usuario"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UsuariosTable;

