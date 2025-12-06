package com.miempresa.mowimarket.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.miempresa.mowimarket.data.remote.RetrofitClient
import com.miempresa.mowimarket.data.repository.PedidoRepository

class PedidoViewModelFactory : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(PedidoViewModel::class.java)) {
            val repository = PedidoRepository(RetrofitClient.apiService)
            @Suppress("UNCHECKED_CAST")
            return PedidoViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
