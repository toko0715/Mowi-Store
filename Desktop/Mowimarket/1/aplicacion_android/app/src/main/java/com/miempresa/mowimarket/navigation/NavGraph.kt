package com.miempresa.mowimarket.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import com.miempresa.mowimarket.ui.viewmodel.AuthViewModelFactory
import com.miempresa.mowimarket.ui.screens.auth.LoginScreen
import com.miempresa.mowimarket.ui.screens.auth.RegisterScreen
import com.miempresa.mowimarket.ui.screens.user.*
import com.miempresa.mowimarket.ui.screens.admin.*
import com.miempresa.mowimarket.ui.viewmodel.AuthViewModel
import com.miempresa.mowimarket.ui.viewmodel.CartViewModel
import com.miempresa.mowimarket.ui.viewmodel.PedidoViewModel
import com.miempresa.mowimarket.ui.viewmodel.PedidoViewModelFactory

/**
 * Grafo de navegación principal
 */
@Composable
fun NavGraph(
    navController: NavHostController,
    startDestination: String,
    onLogout: () -> Unit
) {
    val authViewModel: AuthViewModel = viewModel(
        factory = AuthViewModelFactory(androidx.compose.ui.platform.LocalContext.current)
    )

    val pedidoViewModel: PedidoViewModel = viewModel(factory = PedidoViewModelFactory())

    // Crear una única instancia de CartViewModel para compartir entre pantallas
    val cartViewModel: CartViewModel = viewModel()

    val isAuthenticated by authViewModel.isLoggedIn.collectAsState(initial = false)
    val currentUser by authViewModel.currentUser.collectAsState(initial = null)

    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        // ========== HOME (SIN LOGIN) ==========
        composable(Routes.Home.route) {
            HomeScreen(
                navController = navController,
                isAuthenticated = isAuthenticated,
                cartViewModel = cartViewModel,
                onProfileClick = {
                    if (isAuthenticated) {
                        // Si está logueado, ir a perfil
                        navController.navigate(Routes.Profile.route)
                    } else {
                        // Si no, pedir login
                        navController.navigate(Routes.Login.route)
                    }
                }
            )
        }

        // ========== AUTENTICACIÓN ==========
        composable(Routes.Login.route) {
            LoginScreen(
                onNavigateToRegister = {
                    navController.navigate(Routes.Register.route)
                },
                onLoginSuccess = { isAdmin ->
                    // Volver a Home después de login
                    navController.navigate(Routes.Home.route) {
                        popUpTo(Routes.Login.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Routes.Register.route) {
            RegisterScreen(
                onNavigateToLogin = {
                    navController.popBackStack()
                },
                onRegisterSuccess = {
                    // Ir directo a Home después del registro exitoso
                    navController.navigate(Routes.Home.route) {
                        popUpTo(Routes.Register.route) { inclusive = true }
                    }
                }
            )
        }

        // ========== PANTALLAS DE USUARIO ==========
        composable(Routes.UserHome.route) {
            UserHomeScreen(
                navController = navController,
                onLogout = onLogout
            )
        }

        composable(Routes.ProductList.route) {
            ProductListScreen(
                navController = navController
            )
        }

        composable(
            route = Routes.ProductDetail.route,
            arguments = listOf(
                navArgument("productId") { type = NavType.IntType }
            )
        ) { backStackEntry ->
            val productId = backStackEntry.arguments?.getInt("productId") ?: 0
            ProductDetailScreen(
                productId = productId,
                navController = navController,
                isAuthenticated = isAuthenticated,
                cartViewModel = cartViewModel,
                onLoginRequired = {
                    navController.navigate(Routes.Login.route)
                }
            )
        }

        composable(Routes.Cart.route) {
            CartScreen(
                navController = navController,
                cartViewModel = cartViewModel
            )
        }

        composable(Routes.Checkout.route) {
            CheckoutScreen(
                navController = navController,
                cartViewModel = cartViewModel
            )
        }

        composable(Routes.MyOrders.route) {
            MyOrdersScreen(
                navController = navController
            )
        }

        composable(
            route = Routes.OrderDetail.route,
            arguments = listOf(
                navArgument("orderId") { type = NavType.IntType }
            )
        ) { backStackEntry ->
            val orderId = backStackEntry.arguments?.getInt("orderId") ?: 0
            OrderDetailScreen(
                orderId = orderId,
                navController = navController,
                pedidoViewModel = pedidoViewModel
            )
        }

        composable(Routes.Profile.route) {
            ProfileScreen(
                navController = navController,
                onLogout = onLogout,
                authViewModel = authViewModel
            )
        }

        // ========== PANTALLAS DE ADMINISTRADOR ==========
        composable(Routes.AdminHome.route) {
            AdminHomeScreen(
                navController = navController,
                onLogout = onLogout
            )
        }

        composable(Routes.AdminProducts.route) {
            AdminProductsScreen(
                navController = navController
            )
        }

        composable(Routes.AdminOrders.route) {
            AdminOrdersScreen(
                navController = navController
            )
        }

        composable(Routes.AdminUsers.route) {
            AdminUsersScreen(
                navController = navController
            )
        }

        composable(Routes.AdminStats.route) {
            AdminStatsScreen(
                navController = navController
            )
        }
    }
}
