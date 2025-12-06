package com.miempresa.mowimarket.data.model

import com.google.gson.annotations.SerializedName

/**
 * Modelo de Pedido
 */
data class Pedido(
    @SerializedName("id")
    val id: Int,

    @SerializedName("usuario_id")
    val usuarioId: Int,

    @SerializedName("total")
    val total: Double,

    @SerializedName("estado")
    val estado: EstadoPedido,

    @SerializedName("metodo_pago")
    val metodoPago: MetodoPago,

    @SerializedName("detalles")
    val detalles: List<DetallePedido> = emptyList(),

    @SerializedName("fecha_pedido")
    val fechaPedido: String,

    @SerializedName("fecha_actualizacion")
    val fechaActualizacion: String? = null
) {
    /**
     * Total formateado
     */
    fun totalFormateado(): String = "S/ %.2f".format(total)

    /**
     * Obtiene el color del estado para la UI
     */
    fun getEstadoColor(): String = when (estado) {
        EstadoPedido.PENDIENTE -> "#FFA500"
        EstadoPedido.EN_PROCESO -> "#007BFF"
        EstadoPedido.ENVIADO -> "#17A2B8"
        EstadoPedido.ENTREGADO -> "#28A745"
        EstadoPedido.CANCELADO -> "#DC3545"
    }
}

/**
 * Detalle de Pedido
 */
data class DetallePedido(
    @SerializedName("id")
    val id: Int,

    @SerializedName("pedido_id")
    val pedidoId: Int? = null,

    @SerializedName("producto")
    val producto: Producto,

    @SerializedName("producto_id")
    val productoId: Int? = null,

    @SerializedName("cantidad")
    val cantidad: Int,

    @SerializedName("precio_unitario")
    val precioUnitario: Double,

    @SerializedName("subtotal")
    val subtotal: Double,

    @SerializedName("fecha_creacion")
    val fechaCreacion: String? = null
)

/**
 * Estado del Pedido
 */
enum class EstadoPedido {
    @SerializedName("pendiente")
    PENDIENTE,

    @SerializedName("en_proceso")
    EN_PROCESO,

    @SerializedName("enviado")
    ENVIADO,

    @SerializedName("entregado")
    ENTREGADO,

    @SerializedName("cancelado")
    CANCELADO
}

/**
 * Método de Pago
 */
enum class MetodoPago {
    @SerializedName("tarjeta")
    TARJETA,

    @SerializedName("yape")
    YAPE,

    @SerializedName("transferencia")
    TRANSFERENCIA
}

/**
 * Request para crear pedido desde carrito
 */
data class CrearPedidoRequest(
    @SerializedName("metodo_pago")
    val metodoPago: String // "tarjeta", "yape", o "transferencia"
)
