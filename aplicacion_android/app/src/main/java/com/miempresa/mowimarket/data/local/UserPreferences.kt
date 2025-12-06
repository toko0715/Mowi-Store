package com.miempresa.mowimarket.data.local

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import com.google.gson.Gson
import com.miempresa.mowimarket.data.model.User
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

/**
 * Gestión de preferencias de usuario usando DataStore
 */
class UserPreferences(private val context: Context) {

    companion object {
        private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "user_preferences")

        private val ACCESS_TOKEN_KEY = stringPreferencesKey("access_token")
        private val REFRESH_TOKEN_KEY = stringPreferencesKey("refresh_token")
        private val USER_DATA_KEY = stringPreferencesKey("user_data")
        private val IS_LOGGED_IN_KEY = booleanPreferencesKey("is_logged_in")
    }

    /**
     * Guardar datos de autenticación
     */
    suspend fun saveAuthData(accessToken: String, refreshToken: String, user: User) {
        context.dataStore.edit { preferences ->
            preferences[ACCESS_TOKEN_KEY] = accessToken
            preferences[REFRESH_TOKEN_KEY] = refreshToken
            preferences[USER_DATA_KEY] = Gson().toJson(user)
            preferences[IS_LOGGED_IN_KEY] = true
        }
    }

    /**
     * Obtener access token
     */
    val accessToken: Flow<String?> = context.dataStore.data.map { preferences ->
        preferences[ACCESS_TOKEN_KEY]
    }

    /**
     * Obtener refresh token
     */
    val refreshToken: Flow<String?> = context.dataStore.data.map { preferences ->
        preferences[REFRESH_TOKEN_KEY]
    }

    /**
     * Obtener datos del usuario
     */
    val userData: Flow<User?> = context.dataStore.data.map { preferences ->
        preferences[USER_DATA_KEY]?.let { json ->
            try {
                Gson().fromJson(json, User::class.java)
            } catch (e: Exception) {
                null
            }
        }
    }

    /**
     * Verificar si está logueado
     */
    val isLoggedIn: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[IS_LOGGED_IN_KEY] ?: false
    }

    /**
     * Limpiar datos de autenticación (logout)
     */
    suspend fun clearAuthData() {
        context.dataStore.edit { preferences ->
            preferences.remove(ACCESS_TOKEN_KEY)
            preferences.remove(REFRESH_TOKEN_KEY)
            preferences.remove(USER_DATA_KEY)
            preferences[IS_LOGGED_IN_KEY] = false
        }
    }

    /**
     * Actualizar access token
     */
    suspend fun updateAccessToken(newToken: String) {
        context.dataStore.edit { preferences ->
            preferences[ACCESS_TOKEN_KEY] = newToken
        }
    }
}
