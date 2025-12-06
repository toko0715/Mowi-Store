package com.miempresa.mowimarket.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.miempresa.mowimarket.data.model.Pedido
import com.miempresa.mowimarket.data.repository.PedidoRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class PedidoViewModel(private val repository: PedidoRepository) : ViewModel() {

    private val _pedidos = MutableStateFlow<List<Pedido>>(emptyList())
    val pedidos: StateFlow<List<Pedido>> = _pedidos.asStateFlow()

    private val _pedido = MutableStateFlow<Pedido?>(null)
    val pedido: StateFlow<Pedido?> = _pedido.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    fun loadPedidos(usuarioId: Int) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            try {
                val response = repository.getPedidos(usuarioId)
                if (response.isSuccessful) {
                    _pedidos.value = response.body()?.sortedByDescending { it.fechaPedido } ?: emptyList()
                } else {
                    _error.value = "Error al cargar los pedidos (${response.code()})"
                }
            } catch (e: Exception) {
                _error.value = "No se pudo conectar al servidor: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun loadPedido(pedidoId: Int) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            try {
                val response = repository.getPedido(pedidoId)
                if (response.isSuccessful) {
                    _pedido.value = response.body()
                } else {
                    _error.value = "Error al cargar el pedido (${response.code()})"
                }
            } catch (e: Exception) {
                _error.value = "No se pudo conectar al servidor: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }
}
