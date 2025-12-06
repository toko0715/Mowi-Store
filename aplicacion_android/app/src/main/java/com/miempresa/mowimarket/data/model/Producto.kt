package com.miempresa.mowimarket.data.model

import com.google.gson.annotations.SerializedName

/**
 * Modelo de Producto
 * Corresponde al modelo Producto del backend
 */
data class Producto(
    @SerializedName("id")
    val id: Int,

    @SerializedName("nombre")
    val nombre: String,

    @SerializedName("descripcion")
    val descripcion: String,

    @SerializedName("categoria")
    val categoria: Categoria? = null,

    @SerializedName("categoria_id")
    val categoriaId: Int? = null,

    @SerializedName("precio")
    val precio: Double,

    @SerializedName("stock")
    val stock: Int,

    @SerializedName("vendidos")
    val vendidos: Int = 0,

    @SerializedName("imagen")
    val imagen: String? = null,

    @SerializedName("activo")
    val activo: Boolean = true,

    @SerializedName("fecha_creacion")
    val fechaCreacion: String? = null,

    @SerializedName("fecha_actualizacion")
    val fechaActualizacion: String? = null,

    // Campo calculado en el frontend
    @SerializedName("promedio_resenas")
    val promedioResenas: Double? = null,

    @SerializedName("total_resenas")
    val totalResenas: Int? = null
) {
    /**
     * Indica si el producto está disponible para compra
     */
    fun isDisponible(): Boolean = activo && stock > 0

    /**
     * Precio formateado
     */
    fun precioFormateado(): String = "S/ %.2f".format(precio)
}

/**
 * Modelo de Categoría
 */
data class Categoria(
    @SerializedName("id")
    val id: Int,

    @SerializedName("nombre")
    val nombre: String,

    @SerializedName("descripcion")
    val descripcion: String? = null
)
