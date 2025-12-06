package com.miempresa.mowimarket.data.repository

import com.miempresa.mowimarket.data.remote.ApiService

class PedidoRepository(private val apiService: ApiService) {
    suspend fun getPedidos(usuarioId: Int) = apiService.getPedidos(usuarioId)
    suspend fun getPedido(pedidoId: Int) = apiService.getPedido(pedidoId)
}
