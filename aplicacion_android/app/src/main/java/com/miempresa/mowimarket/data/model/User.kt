package com.miempresa.mowimarket.data.model

import com.google.gson.annotations.SerializedName

/**
 * Modelo de Usuario
 * Corresponde al modelo User del backend Django
 */
data class User(
    @SerializedName("id")
    val id: Int,

    @SerializedName("email")
    val email: String,

    @SerializedName("name")
    val name: String,

    @SerializedName("is_active")
    val isActive: Boolean = true,

    @SerializedName("is_staff")
    val isStaff: Boolean = false,

    @SerializedName("is_admin")
    val isAdmin: Boolean = false,

    @SerializedName("date_joined")
    val dateJoined: String? = null
)

/**
 * Request para Login
 */
data class LoginRequest(
    @SerializedName("email")
    val email: String,

    @SerializedName("password")
    val password: String
)

/**
 * Request para Registro
 */
data class RegisterRequest(
    @SerializedName("email")
    val email: String,

    @SerializedName("name")
    val name: String,

    @SerializedName("password")
    val password: String,

    @SerializedName("password2")
    val password2: String
)

/**
 * Response de Login/Register con tokens JWT
 */
data class AuthResponse(
    @SerializedName("access")
    val accessToken: String? = null,

    @SerializedName("refresh")
    val refreshToken: String? = null,

    @SerializedName("user")
    val user: User
)

/**
 * Respuesta de error
 */
data class ErrorResponse(
    @SerializedName("error")
    val error: String? = null,

    @SerializedName("detail")
    val detail: String? = null,

    @SerializedName("message")
    val message: String? = null
)
