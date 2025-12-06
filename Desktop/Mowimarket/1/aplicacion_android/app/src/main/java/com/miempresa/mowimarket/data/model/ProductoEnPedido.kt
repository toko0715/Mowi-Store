package com.miempresa.mowimarket.data.model

import com.google.gson.annotations.SerializedName

data class ProductoEnPedido(
    @SerializedName("nombre")
    val nombre: String,
    @SerializedName("imagen_url")
    val imagenUrl: String? = null
)
