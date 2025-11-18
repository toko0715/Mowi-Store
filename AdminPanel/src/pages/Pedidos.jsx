import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';
import PedidosTable from './pedidos/PedidosTable';
import UsuariosTable from './pedidos/UsuariosTable';
import PedidoDetailModal from './pedidos/PedidoDetailModal';
import UsuarioFormModal from './pedidos/UsuarioFormModal';
import useModal from '../hooks/useModal';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';

function Pedidos() {
  const [activeTab, setActiveTab] = useState('pedidos');
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [loadingDetalles, setLoadingDetalles] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'cliente',
    activo: true
  });
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
  const [filtroFechaHasta, setFiltroFechaHasta] = useState('');
  
  const usuarioModal = useModal();
  const pedidoDetailModal = useModal();
  const confirmModal = useModal();
  const toast = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [pedidosRes, usuariosRes] = await Promise.all([
        api.getPedidos(),
        api.getUsuarios()
      ]);
      setPedidos(pedidosRes);
      setUsuarios(usuariosRes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  // CRUD de Usuarios (optimizado con useCallback)
  const handleCreateUser = useCallback(async () => {
    try {
      await api.createUsuario(formData);
      toast.success('Usuario creado exitosamente');
      usuarioModal.close();
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error al crear el usuario');
    }
  }, [formData, usuarioModal, toast]);

  const handleUpdateUser = useCallback(async (id) => {
    try {
      await api.updateUsuario(id, formData);
      toast.success('Usuario actualizado exitosamente');
      usuarioModal.close();
      setEditingUser(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error al actualizar el usuario');
    }
  }, [formData, usuarioModal, toast]);

  const handleDeleteUser = useCallback((id) => {
    confirmModal.open({
      id,
      message: '¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.'
    });
  }, [confirmModal]);

  const confirmDeleteUser = useCallback(async () => {
    const userId = confirmModal.data?.id;
    if (!userId) return;
    
    try {
      await api.deleteUsuario(userId);
      toast.success('Usuario eliminado exitosamente');
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar el usuario');
    }
  }, [confirmModal.data, toast]);

  const handleEditClick = useCallback((usuario) => {
    setEditingUser(usuario);
    setFormData({
      nombre: usuario.nombre || usuario.name || '',
      email: usuario.email || '',
      password: '',
      rol: usuario.rol || (usuario.is_admin || usuario.is_staff ? 'admin' : 'cliente'),
      activo: usuario.activo !== undefined ? usuario.activo : (usuario.is_active !== undefined ? usuario.is_active : true)
    });
    usuarioModal.open(usuario);
  }, [usuarioModal]);

  const handleNewClick = useCallback(() => {
    setEditingUser(null);
    resetForm();
    usuarioModal.open();
  }, [usuarioModal]);

  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      password: '',
      rol: 'cliente',
      activo: true
    });
  };

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (editingUser) {
      handleUpdateUser(editingUser.id);
    } else {
      handleCreateUser();
    }
  }, [editingUser, handleUpdateUser, handleCreateUser]);

  const handleViewDetails = useCallback(async (pedido) => {
    pedidoDetailModal.open(pedido);
    setLoadingDetalles(true);
    
    try {
      const detalles = await api.getDetallesPedido();
      const detallesFiltered = detalles.filter(d => d.pedido === pedido.id);
      setDetallesPedido(detallesFiltered);
    } catch (error) {
      console.error('Error fetching detalles:', error);
      setDetallesPedido([]);
    } finally {
      setLoadingDetalles(false);
    }
  }, [pedidoDetailModal]);

  // Actualizar estado de pedido (optimizado)
  const handleUpdateEstado = useCallback(async (pedidoId, nuevoEstado) => {
    try {
      const pedido = pedidos.find(p => p.id === pedidoId);
      if (!pedido) return;
      
      await api.updatePedido(pedidoId, {
        ...pedido,
        estado: nuevoEstado
      });
      
      toast.success(`Estado actualizado a: ${nuevoEstado}`);
      fetchData();
    } catch (error) {
      console.error('Error updating estado:', error);
      toast.error('Error al actualizar el estado del pedido');
    }
  }, [pedidos, toast]);

  // Filtrar pedidos (optimizado con useMemo)
  const filteredPedidos = useMemo(() => {
    return pedidos.filter(pedido => {
      const matchesSearch = pedido.usuario_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.id.toString().includes(searchTerm);
      const matchesEstado = !filtroEstado || pedido.estado === filtroEstado;
      
      let matchesFecha = true;
      if (filtroFechaDesde) {
        const fechaPedido = new Date(pedido.fecha_pedido);
        const fechaDesde = new Date(filtroFechaDesde);
        matchesFecha = fechaPedido >= fechaDesde;
      }
      if (filtroFechaHasta) {
        const fechaPedido = new Date(pedido.fecha_pedido);
        const fechaHasta = new Date(filtroFechaHasta);
        fechaHasta.setHours(23, 59, 59, 999);
        matchesFecha = matchesFecha && fechaPedido <= fechaHasta;
      }
      
      return matchesSearch && matchesEstado && matchesFecha;
    });
  }, [pedidos, searchTerm, filtroEstado, filtroFechaDesde, filtroFechaHasta]);

  // Filtrar usuarios (optimizado con useMemo)
  const filteredUsuarios = useMemo(() => {
    return usuarios.filter(usuario => {
      const nombre = (usuario.nombre || usuario.name || '').toLowerCase();
      const email = (usuario.email || '').toLowerCase();
      const term = searchTerm.toLowerCase();
      return nombre.includes(term) || email.includes(term);
    });
  }, [usuarios, searchTerm]);

  return (
    <main style={{
      marginLeft: '280px',
      padding: '2rem',
      backgroundColor: '#f7fafc'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#2d3748',
          marginBottom: '0.5rem'
        }}>
          Pedidos / Usuarios
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#718096'
        }}>
          Gestiona pedidos y usuarios del sistema
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => setActiveTab('pedidos')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === 'pedidos' ? '#ff6b35' : 'white',
            color: activeTab === 'pedidos' ? 'white' : '#4a5568',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Pedidos
        </button>
        <button
          onClick={() => setActiveTab('usuarios')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === 'usuarios' ? '#ff6b35' : 'white',
            color: activeTab === 'usuarios' ? 'white' : '#4a5568',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Usuarios
        </button>
      </div>

      {/* Search and Filters */}
      <div style={{
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            placeholder={activeTab === 'pedidos' ? 'Buscar pedidos (ID, cliente)...' : 'Buscar usuarios...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
          {activeTab === 'usuarios' && (
            <button
              onClick={handleNewClick}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#ff6b35',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              + Nuevo Usuario
            </button>
          )}
        </div>
        
        {/* Filtros para Pedidos */}
        {activeTab === 'pedidos' && (
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            padding: '1rem',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem'
              }}>Estado</label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En Proceso</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem'
              }}>Fecha Desde</label>
              <input
                type="date"
                value={filtroFechaDesde}
                onChange={(e) => setFiltroFechaDesde(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem'
              }}>Fecha Hasta</label>
              <input
                type="date"
                value={filtroFechaHasta}
                onChange={(e) => setFiltroFechaHasta(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            {(filtroEstado || filtroFechaDesde || filtroFechaHasta) && (
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  onClick={() => {
                    setFiltroEstado('');
                    setFiltroFechaDesde('');
                    setFiltroFechaHasta('');
                  }}
                  style={{
                    padding: '0.75rem 1rem',
                    background: '#e2e8f0',
                    color: '#4a5568',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Limpiar Filtros
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Cargando datos...</p>
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          {activeTab === 'pedidos' ? (
            <div>
              <div style={{
                marginBottom: '1rem',
                color: '#718096',
                fontSize: '0.875rem'
              }}>
                Pedidos ({filteredPedidos.length})
              </div>
              <PedidosTable 
                pedidos={filteredPedidos}
                onViewDetails={handleViewDetails}
                onUpdateEstado={handleUpdateEstado}
              />
            </div>
          ) : (
            <div>
              <div style={{
                marginBottom: '1rem',
                color: '#718096',
                fontSize: '0.875rem'
              }}>
                Usuarios ({filteredUsuarios.length})
              </div>
              <UsuariosTable 
                usuarios={filteredUsuarios}
                onEdit={handleEditClick}
                onDelete={handleDeleteUser}
              />
            </div>
          )}
        </div>
      )}

      {/* Modales */}
      <UsuarioFormModal
        isOpen={usuarioModal.isOpen}
        onClose={() => {
          usuarioModal.close();
          setEditingUser(null);
          resetForm();
        }}
        usuario={editingUser}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleSubmit}
      />

      <PedidoDetailModal
        isOpen={pedidoDetailModal.isOpen}
        onClose={() => {
          pedidoDetailModal.close();
          setDetallesPedido([]);
        }}
        pedido={pedidoDetailModal.data}
        detalles={detallesPedido}
        loading={loadingDetalles}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.close}
        onConfirm={confirmDeleteUser}
        title="Eliminar Usuario"
        message={confirmModal.data?.message || '¿Está seguro de que desea eliminar este usuario?'}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </main>
  );
}

export default Pedidos;
