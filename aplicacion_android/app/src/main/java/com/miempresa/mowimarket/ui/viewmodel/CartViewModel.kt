package com.miempresa.mowimarket.ui.viewmodel

import androidx.lifecycle.ViewModel
import com.miempresa.mowimarket.data.model.CartItem
import com.miempresa.mowimarket.data.model.Producto
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * ViewModel para el carrito de compras
 */
class CartViewModel : ViewModel() {

    private val _cartItems = MutableStateFlow<List<CartItem>>(emptyList())
    val cartItems: StateFlow<List<CartItem>> = _cartItems.asStateFlow()

    private val _cartTotal = MutableStateFlow(0.0)
    val cartTotal: StateFlow<Double> = _cartTotal.asStateFlow()

    private val _itemCount = MutableStateFlow(0)
    val itemCount: StateFlow<Int> = _itemCount.asStateFlow()

    /**
     * Agregar producto al carrito
     */
    fun addToCart(producto: Producto, cantidad: Int = 1) {
        val currentItems = _cartItems.value.toMutableList()

        // Verificar si el producto ya está en el carrito
        val existingItemIndex = currentItems.indexOfFirst { it.producto.id == producto.id }

        if (existingItemIndex != -1) {
            // Si ya existe, aumentar la cantidad
            val existingItem = currentItems[existingItemIndex]
            existingItem.cantidad += cantidad
            currentItems[existingItemIndex] = existingItem
        } else {
            // Si no existe, agregar nuevo item
            currentItems.add(CartItem(producto, cantidad))
        }

        _cartItems.value = currentItems
        updateCartTotals()
    }

    /**
     * Actualizar cantidad de un producto en el carrito
     */
    fun updateQuantity(productId: Int, cantidad: Int) {
        val currentItems = _cartItems.value.toMutableList()
        val itemIndex = currentItems.indexOfFirst { it.producto.id == productId }

        if (itemIndex != -1) {
            if (cantidad > 0) {
                currentItems[itemIndex].cantidad = cantidad
            } else {
                currentItems.removeAt(itemIndex)
            }
            _cartItems.value = currentItems
            updateCartTotals()
        }
    }

    /**
     * Remover producto del carrito
     */
    fun removeFromCart(productId: Int) {
        val currentItems = _cartItems.value.toMutableList()
        currentItems.removeAll { it.producto.id == productId }
        _cartItems.value = currentItems
        updateCartTotals()
    }

    /**
     * Limpiar el carrito
     */
    fun clearCart() {
        _cartItems.value = emptyList()
        updateCartTotals()
    }

    /**
     * Actualizar totales del carrito
     */
    private fun updateCartTotals() {
        val items = _cartItems.value
        _cartTotal.value = items.sumOf { it.subtotal() }
        _itemCount.value = items.sumOf { it.cantidad }
    }

    /**
     * Obtener total formateado
     */
    fun getTotalFormateado(): String = "S/ %.2f".format(_cartTotal.value)
}
