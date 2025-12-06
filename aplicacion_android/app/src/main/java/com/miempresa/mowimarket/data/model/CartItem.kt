package com.miempresa.mowimarket.data.model

/**
 * Item del carrito de compras
 */
data class CartItem(
    val producto: Producto,
    var cantidad: Int = 1
) {
    /**
     * Subtotal del item (precio * cantidad)
     */
    fun subtotal(): Double = producto.precio * cantidad

    /**
     * Subtotal formateado
     */
    fun subtotalFormateado(): String = "S/ %.2f".format(subtotal())
}
