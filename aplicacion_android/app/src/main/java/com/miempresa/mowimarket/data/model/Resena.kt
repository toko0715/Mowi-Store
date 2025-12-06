package com.miempresa.mowimarket.data.model

import com.google.gson.annotations.SerializedName

/**
 * Modelo de Reseña
 */
data class Resena(
    @SerializedName("id")
    val id: Int,

    @SerializedName("usuario_id")
    val usuarioId: Int,

    @SerializedName("usuario_nombre")
    val usuarioNombre: String? = null,

    @SerializedName("producto_id")
    val productoId: Int,

    @SerializedName("calificacion")
    val calificacion: Int, // 1-5

    @SerializedName("comentario")
    val comentario: String,

    @SerializedName("fecha_creacion")
    val fechaCreacion: String
)

/**
 * Request para crear reseña
 */
data class CrearResenaRequest(
    @SerializedName("producto_id")
    val productoId: Int,

    @SerializedName("calificacion")
    val calificacion: Int,

    @SerializedName("comentario")
    val comentario: String
)

/**
 * Respuesta de promedio de reseñas
 */
data class PromedioResenasResponse(
    @SerializedName("promedio")
    val promedio: Double,

    @SerializedName("total")
    val total: Int
)
