package com.miempresa.mowimarket.ui.viewmodel

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.miempresa.mowimarket.data.local.AuthManager
import com.miempresa.mowimarket.data.model.LoginRequest
import com.miempresa.mowimarket.data.model.RegisterRequest
import com.miempresa.mowimarket.data.model.User
import com.miempresa.mowimarket.data.remote.RetrofitClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * ViewModel para autenticación
 */
class AuthViewModel(context: Context) : ViewModel() {

    private val authManager = AuthManager(context)
    private val authApiService = RetrofitClient.authApiService

    // Estado de UI
    private val _uiState = MutableStateFlow<AuthUiState>(AuthUiState.Idle)
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    // Usuario actual
    val currentUser = authManager.currentUser
    val isLoggedIn = authManager.isLoggedIn

    init {
        // Inicializar token si existe
        viewModelScope.launch {
            authManager.initializeAuthToken()
        }
    }

    /**
     * Login
     */
    fun login(email: String, password: String) {
        viewModelScope.launch {
            _uiState.value = AuthUiState.Loading

            try {
                val request = LoginRequest(email, password)
                val response = authApiService.login(request)

                if (response.isSuccessful && response.body() != null) {
                    val authResponse = response.body()!!

                    // Guardar autenticación
                    authManager.saveAuth(authResponse)

                    // Verificar si es admin
                    val isAdmin = authResponse.user.isAdmin || authResponse.user.isStaff

                    _uiState.value = AuthUiState.Success(
                        user = authResponse.user,
                        isAdmin = isAdmin
                    )
                } else {
                    val errorMessage = response.errorBody()?.string() ?: "Credenciales inválidas"
                    _uiState.value = AuthUiState.Error(errorMessage)
                }
            } catch (e: Exception) {
                _uiState.value = AuthUiState.Error(
                    e.message ?: "Error de conexión con el servidor"
                )
            }
        }
    }

    /**
     * Registro
     */
    fun register(email: String, name: String, password: String, password2: String) {
        viewModelScope.launch {
            _uiState.value = AuthUiState.Loading

            // Validaciones
            if (password != password2) {
                _uiState.value = AuthUiState.Error("Las contraseñas no coinciden")
                return@launch
            }

            if (password.length < 6) {
                _uiState.value = AuthUiState.Error("La contraseña debe tener al menos 6 caracteres")
                return@launch
            }

            try {
                val request = RegisterRequest(email, name, password, password2)
                val response = authApiService.register(request)

                if (response.isSuccessful && response.body() != null) {
                    val authResponse = response.body()!!

                    // Guardar autenticación
                    authManager.saveAuth(authResponse)

                    _uiState.value = AuthUiState.Success(
                        user = authResponse.user,
                        isAdmin = false
                    )
                } else {
                    val errorMessage = response.errorBody()?.string() ?: "Error al registrar"
                    _uiState.value = AuthUiState.Error(errorMessage)
                }
            } catch (e: Exception) {
                _uiState.value = AuthUiState.Error(
                    e.message ?: "Error de conexión con el servidor"
                )
            }
        }
    }

    /**
     * Logout
     */
    fun logout() {
        viewModelScope.launch {
            authManager.logout()
            _uiState.value = AuthUiState.Idle
        }
    }

    /**
     * Resetear estado
     */
    fun resetState() {
        _uiState.value = AuthUiState.Idle
    }
}

/**
 * Estados de UI para autenticación
 */
sealed class AuthUiState {
    object Idle : AuthUiState()
    object Loading : AuthUiState()
    data class Success(val user: User, val isAdmin: Boolean) : AuthUiState()
    data class Error(val message: String) : AuthUiState()
}
