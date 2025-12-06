package com.miempresa.mowimarket.navigation

/**
 * Rutas de navegación de la aplicación
 */
sealed class Routes(val route: String) {

    // Pantalla principal (sin login)
    object Home : Routes("home")

    // Autenticación
    object Login : Routes("login")
    object Register : Routes("register")

    // Usuario
    object UserHome : Routes("user_home")
    object ProductList : Routes("product_list")
    object ProductDetail : Routes("product_detail/{productId}") {
        fun createRoute(productId: Int) = "product_detail/$productId"
    }
    object Cart : Routes("cart")
    object Checkout : Routes("checkout")
    object MyOrders : Routes("my_orders")
    object OrderDetail : Routes("order_detail/{orderId}") {
        fun createRoute(orderId: Int) = "order_detail/$orderId"
    }
    object Profile : Routes("profile")

    // Administrador
    object AdminHome : Routes("admin_home")
    object AdminProducts : Routes("admin_products")
    object AdminOrders : Routes("admin_orders")
    object AdminUsers : Routes("admin_users")
    object AdminStats : Routes("admin_stats")
}
