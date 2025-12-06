package com.miempresa.mowimarket.data.remote

import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

/**
 * Cliente Retrofit para la API
 *
 * IMPORTANTE: En Android, "localhost" se refiere al emulador, no a tu máquina host.
 * - Emulador Android: Usa 10.0.2.2
 * - Dispositivo físico: Usa la IP local de tu máquina (ej: 192.168.1.100)
 */
object RetrofitClient {

    /**
     * Base URL para Spring Boot API (puerto 8080)
     * Usar 10.0.2.2 para emulador o IP local para dispositivo físico
     */
    private const val SPRING_BOOT_BASE_URL = "http://10.0.2.2:8080/api/"

    /**
     * Base URL para Django API (puerto 8000)
     * Solo usada para autenticación
     */
    private const val DJANGO_BASE_URL = "http://10.0.2.2:8000/api/"

    /**
     * Token JWT almacenado en memoria
     * En producción, usar DataStore o SharedPreferences encriptado
     */
    private var authToken: String? = null

    /**
     * Interceptor para agregar token JWT a las requests
     */
    private val authInterceptor = Interceptor { chain ->
        val requestBuilder = chain.request().newBuilder()

        // Agregar token si existe
        authToken?.let { token ->
            requestBuilder.addHeader("Authorization", "Bearer $token")
        }

        chain.proceed(requestBuilder.build())
    }

    /**
     * Logging interceptor para debug
     */
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    /**
     * Cliente OkHttp compartido
     */
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(authInterceptor)
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()

    /**
     * Retrofit para Spring Boot API
     * Usado para: productos, carrito, pedidos, reseñas
     */
    private val retrofitSpringBoot: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(SPRING_BOOT_BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    /**
     * Retrofit para Django API
     * Usado solo para: login, register
     */
    private val retrofitDjango: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(DJANGO_BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    /**
     * Servicio API para Spring Boot
     */
    val apiService: ApiService by lazy {
        retrofitSpringBoot.create(ApiService::class.java)
    }

    /**
     * Servicio API para Django (autenticación)
     */
    val authApiService: ApiService by lazy {
        retrofitDjango.create(ApiService::class.java)
    }

    /**
     * Guardar token JWT
     */
    fun setAuthToken(token: String) {
        authToken = token
    }

    /**
     * Limpiar token JWT (logout)
     */
    fun clearAuthToken() {
        authToken = null
    }

    /**
     * Verificar si hay token
     */
    fun hasAuthToken(): Boolean = authToken != null
}
