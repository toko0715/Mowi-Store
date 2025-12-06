package com.miempresa.mowimarket.ui.viewmodel

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.miempresa.mowimarket.data.model.Producto
import com.miempresa.mowimarket.data.remote.RetrofitClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * ViewModel para productos
 */
class ProductViewModel : ViewModel() {

    private val apiService = RetrofitClient.apiService

    // Estado de UI para lista de productos
    private val _productsState = MutableStateFlow<ProductsUiState>(ProductsUiState.Loading)
    val productsState: StateFlow<ProductsUiState> = _productsState.asStateFlow()

    // Estado de UI para detalle de producto
    private val _productDetailState = MutableStateFlow<ProductDetailUiState>(ProductDetailUiState.Loading)
    val productDetailState: StateFlow<ProductDetailUiState> = _productDetailState.asStateFlow()

    /**
     * Cargar productos
     */
    fun loadProducts() {
        viewModelScope.launch {
            _productsState.value = ProductsUiState.Loading
            try {
                val response = apiService.getProductos()
                if (response.isSuccessful && response.body() != null) {
                    _productsState.value = ProductsUiState.Success(response.body()!!)
                } else {
                    _productsState.value = ProductsUiState.Error("Error al cargar productos")
                }
            } catch (e: Exception) {
                _productsState.value = ProductsUiState.Error(
                    e.message ?: "Error de conexión"
                )
            }
        }
    }

    /**
     * Cargar detalle de producto
     */
    fun loadProductDetail(productId: Int) {
        viewModelScope.launch {
            _productDetailState.value = ProductDetailUiState.Loading
            try {
                val response = apiService.getProducto(productId)
                if (response.isSuccessful && response.body() != null) {
                    _productDetailState.value = ProductDetailUiState.Success(response.body()!!)
                } else {
                    _productDetailState.value = ProductDetailUiState.Error("Producto no encontrado")
                }
            } catch (e: Exception) {
                _productDetailState.value = ProductDetailUiState.Error(
                    e.message ?: "Error de conexión"
                )
            }
        }
    }
}

/**
 * Estados de UI para lista de productos
 */
sealed class ProductsUiState {
    object Loading : ProductsUiState()
    data class Success(val products: List<Producto>) : ProductsUiState()
    data class Error(val message: String) : ProductsUiState()
}

/**
 * Estados de UI para detalle de producto
 */
sealed class ProductDetailUiState {
    object Loading : ProductDetailUiState()
    data class Success(val product: Producto) : ProductDetailUiState()
    data class Error(val message: String) : ProductDetailUiState()
}
