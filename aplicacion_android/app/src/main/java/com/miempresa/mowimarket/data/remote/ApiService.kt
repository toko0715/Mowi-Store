package com.miempresa.mowimarket.data.remote

import com.miempresa.mowimarket.data.model.*
import retrofit2.Response
import retrofit2.http.*

/**
 * Interfaz de servicios API para Django y Spring Boot
 */
interface ApiService {

    // ========== AUTENTICACIÓN (Django API - Puerto 8000) ==========

    @POST("login/")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @POST("register/")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>

    // ========== PRODUCTOS (Spring Boot API - Puerto 8080) ==========

    @GET("productos")
    suspend fun getProductos(): Response<List<Producto>>

    @GET("productos/{id}")
    suspend fun getProducto(@Path("id") id: Int): Response<Producto>

    @GET("productos/categoria/{categoriaId}")
    suspend fun getProductosPorCategoria(@Path("categoriaId") categoriaId: Int): Response<List<Producto>>

    @GET("productos/top-vendidos")
    suspend fun getProductosTopVendidos(): Response<List<Producto>>

    @GET("productos/buscar")
    suspend fun buscarProductos(@Query("q") query: String): Response<List<Producto>>

    // ========== CATEGORÍAS (Spring Boot API) ==========

    @GET("categorias")
    suspend fun getCategorias(): Response<List<Categoria>>

    @GET("categorias/{id}")
    suspend fun getCategoria(@Path("id") id: Int): Response<Categoria>

    // ========== CARRITO (Spring Boot API) ==========

    @GET("carrito/{usuarioId}")
    suspend fun getCarrito(@Path("usuarioId") usuarioId: Int): Response<Carrito>

    @POST("carrito/{usuarioId}/agregar")
    suspend fun agregarAlCarrito(
        @Path("usuarioId") usuarioId: Int,
        @Body request: AgregarCarritoRequest
    ): Response<ItemCarrito>

    @PUT("carrito/item/{itemId}")
    suspend fun actualizarItemCarrito(
        @Path("itemId") itemId: Int,
        @Body request: ActualizarCarritoRequest
    ): Response<ItemCarrito>

    @DELETE("carrito/item/{itemId}")
    suspend fun eliminarItemCarrito(@Path("itemId") itemId: Int): Response<Unit>

    @DELETE("carrito/{usuarioId}/vaciar")
    suspend fun vaciarCarrito(@Path("usuarioId") usuarioId: Int): Response<Unit>

    // ========== PEDIDOS (Spring Boot API) ==========

    @GET("pedidos/{usuarioId}")
    suspend fun getPedidos(@Path("usuarioId") usuarioId: Int): Response<List<Pedido>>

    @GET("pedidos/detalle/{pedidoId}")
    suspend fun getPedido(@Path("pedidoId") pedidoId: Int): Response<Pedido>

    @POST("pedidos/{usuarioId}/crear-desde-carrito")
    suspend fun crearPedidoDesdeCarrito(
        @Path("usuarioId") usuarioId: Int,
        @Body request: CrearPedidoRequest
    ): Response<Pedido>

    @PUT("pedidos/{pedidoId}/estado")
    suspend fun actualizarEstadoPedido(
        @Path("pedidoId") pedidoId: Int,
        @Body estado: Map<String, String>
    ): Response<Pedido>

    // ========== RESEÑAS (Spring Boot API) ==========

    @GET("resenas/producto/{productoId}")
    suspend fun getResenasPorProducto(@Path("productoId") productoId: Int): Response<List<Resena>>

    @POST("resenas")
    suspend fun crearResena(@Body request: CrearResenaRequest): Response<Resena>

    @GET("resenas/promedio/{productoId}")
    suspend fun getPromedioResenas(@Path("productoId") productoId: Int): Response<PromedioResenasResponse>

    // ========== BÚSQUEDA CON IA (Spring Boot API) ==========

    @GET("busqueda/gemini")
    suspend fun busquedaConIA(@Query("query") query: String): Response<List<Producto>>
}
