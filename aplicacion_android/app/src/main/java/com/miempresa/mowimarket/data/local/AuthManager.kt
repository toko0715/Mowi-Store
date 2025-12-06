package com.miempresa.mowimarket.data.local

import android.content.Context
import com.miempresa.mowimarket.data.model.AuthResponse
import com.miempresa.mowimarket.data.model.User
import com.miempresa.mowimarket.data.remote.RetrofitClient
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first

/**
 * Gestor de autenticación
 * Maneja login, logout y estado de sesión
 */
class AuthManager(context: Context) {

    private val userPreferences = UserPreferences(context)

    /**
     * Usuario actual
     */
    val currentUser: Flow<User?> = userPreferences.userData

    /**
     * Estado de login
     */
    val isLoggedIn: Flow<Boolean> = userPreferences.isLoggedIn

    /**
     * Access token
     */
    val accessToken: Flow<String?> = userPreferences.accessToken

    /**
     * Inicializar token en RetrofitClient
     */
    suspend fun initializeAuthToken() {
        val token = userPreferences.accessToken.first()
        token?.let {
            RetrofitClient.setAuthToken(it)
        }
    }

    /**
     * Guardar datos de autenticación
     */
    suspend fun saveAuth(authResponse: AuthResponse) {
        // Verificar que los tokens no sean null
        val accessToken = authResponse.accessToken
        val refreshToken = authResponse.refreshToken

        if (accessToken != null && refreshToken != null) {
            // Guardar en DataStore
            userPreferences.saveAuthData(
                accessToken = accessToken,
                refreshToken = refreshToken,
                user = authResponse.user
            )

            // Configurar token en Retrofit
            RetrofitClient.setAuthToken(accessToken)
        } else {
            throw IllegalStateException("El servidor no devolvió tokens de autenticación válidos")
        }
    }

    /**
     * Cerrar sesión
     */
    suspend fun logout() {
        userPreferences.clearAuthData()
        RetrofitClient.clearAuthToken()
    }

    /**
     * Verificar si es administrador
     */
    suspend fun isAdmin(): Boolean {
        val user = currentUser.first()
        return user?.isAdmin == true || user?.isStaff == true
    }

    /**
     * Verificar si es staff
     */
    suspend fun isStaff(): Boolean {
        val user = currentUser.first()
        return user?.isStaff == true
    }

    /**
     * Obtener ID del usuario actual
     */
    suspend fun getCurrentUserId(): Int? {
        return currentUser.first()?.id
    }
}
