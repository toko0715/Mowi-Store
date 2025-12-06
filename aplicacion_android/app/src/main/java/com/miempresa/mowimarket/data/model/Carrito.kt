package com.miempresa.mowimarket.data.model

import com.google.gson.annotations.SerializedName

/**
 * Modelo de Carrito
 */
data class Carrito(
    @SerializedName("id")
    val id: Int,

    @SerializedName("usuario_id")
    val usuarioId: Int,

    @SerializedName("items")
    val items: List<ItemCarrito> = emptyList(),

    @SerializedName("total")
    val total: Double = 0.0,

    @SerializedName("fecha_creacion")
    val fechaCreacion: String? = null,

    @SerializedName("fecha_actualizacion")
    val fechaActualizacion: String? = null
) {
    /**
     * Cantidad total de productos en el carrito
     */
    fun cantidadTotal(): Int = items.sumOf { it.cantidad }

    /**
     * Total formateado
     */
    fun totalFormateado(): String = "S/ %.2f".format(total)
}

/**
 * Modelo de Item del Carrito
 */
data class ItemCarrito(
    @SerializedName("id")
    val id: Int,

    @SerializedName("carrito_id")
    val carritoId: Int? = null,

    @SerializedName("producto")
    val producto: Producto,

    @SerializedName("producto_id")
    val productoId: Int? = null,

    @SerializedName("cantidad")
    val cantidad: Int,

    @SerializedName("subtotal")
    val subtotal: Double,

    @SerializedName("fecha_creacion")
    val fechaCreacion: String? = null
) {
    /**
     * Subtotal formateado
     */
    fun subtotalFormateado(): String = "S/ %.2f".format(subtotal)
}

/**
 * Request para agregar producto al carrito
 */
data class AgregarCarritoRequest(
    @SerializedName("producto_id")
    val productoId: Int,

    @SerializedName("cantidad")
    val cantidad: Int = 1
)

/**
 * Request para actualizar cantidad de item
 */
data class ActualizarCarritoRequest(
    @SerializedName("cantidad")
    val cantidad: Int
)
