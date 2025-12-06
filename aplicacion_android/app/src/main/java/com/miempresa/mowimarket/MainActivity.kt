package com.miempresa.mowimarket

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.rememberNavController
import com.miempresa.mowimarket.data.local.AuthManager
import com.miempresa.mowimarket.navigation.NavGraph
import com.miempresa.mowimarket.navigation.Routes
import com.miempresa.mowimarket.ui.theme.MowiMarketTheme
import com.miempresa.mowimarket.ui.viewmodel.AuthViewModel
import com.miempresa.mowimarket.ui.viewmodel.AuthViewModelFactory
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MowiMarketTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    MowiMarketApp()
                }
            }
        }
    }
}

@Composable
fun MowiMarketApp() {
    val navController = rememberNavController()
    val scope = rememberCoroutineScope()

    // ViewModel de autenticación
    val authViewModel: AuthViewModel = viewModel(
        factory = AuthViewModelFactory(androidx.compose.ui.platform.LocalContext.current)
    )

    // Estado de login y usuario
    val isLoggedIn by authViewModel.isLoggedIn.collectAsState(initial = false)
    val currentUser by authViewModel.currentUser.collectAsState(initial = null)

    // Siempre iniciar en Home (sin login requerido)
    val startDestination = Routes.Home.route

    // Función de logout
    val handleLogout: () -> Unit = {
        scope.launch {
            authViewModel.logout()
            navController.navigate(Routes.Login.route) {
                popUpTo(0) { inclusive = true }
            }
        }
    }

    NavGraph(
        navController = navController,
        startDestination = startDestination,
        onLogout = handleLogout
    )
}
