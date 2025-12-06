package com.miempresa.mowimarket.data.local

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.miempresa.mowimarket.data.model.Pedido
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

/**
 * Gestor de pedidos locales
 * Guarda pedidos en el dispositivo usando DataStore
 * NOTA: Solo para demostración. En producción, usar backend.
 */
private val Context.orderDataStore by preferencesDataStore(name = "local_orders")

class LocalOrderManager(private val context: Context) {

    private val gson = Gson()
    private val ORDERS_KEY = stringPreferencesKey("orders_json")

    /**
     * Guardar un nuevo pedido
     */
    suspend fun addOrder(pedido: Pedido) {
        context.orderDataStore.edit { preferences ->
            // Obtener pedidos actuales
            val currentOrdersJson = preferences[ORDERS_KEY] ?: "[]"
            val currentOrders = deserializeOrders(currentOrdersJson).toMutableList()

            // Agregar nuevo pedido
            currentOrders.add(pedido)

            // Guardar lista actualizada
            preferences[ORDERS_KEY] = serializeOrders(currentOrders)
        }
    }

    /**
     * Obtener todos los pedidos guardados
     */
    suspend fun getOrders(): List<Pedido> {
        val ordersJson = context.orderDataStore.data.map { preferences ->
            preferences[ORDERS_KEY] ?: "[]"
        }.first()

        return deserializeOrders(ordersJson)
    }

    /**
     * Limpiar todos los pedidos (al cerrar sesión)
     */
    suspend fun clearOrders() {
        context.orderDataStore.edit { preferences ->
            preferences.remove(ORDERS_KEY)
        }
    }

    /**
     * Serializar lista de pedidos a JSON
     */
    private fun serializeOrders(orders: List<Pedido>): String {
        return gson.toJson(orders)
    }

    /**
     * Deserializar JSON a lista de pedidos
     */
    private fun deserializeOrders(json: String): List<Pedido> {
        return try {
            val type = object : TypeToken<List<Pedido>>() {}.type
            gson.fromJson(json, type) ?: emptyList()
        } catch (e: Exception) {
            emptyList()
        }
    }

    /**
     * Obtener el próximo ID de pedido
     */
    suspend fun getNextOrderId(): Int {
        val orders = getOrders()
        return if (orders.isEmpty()) 1 else orders.maxOf { it.id } + 1
    }
}
