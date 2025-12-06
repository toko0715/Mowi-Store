package com.miempresa.mowimarket.ui.screens.user

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import coil.compose.AsyncImage
import com.miempresa.mowimarket.data.model.DetallePedido
import com.miempresa.mowimarket.data.model.MetodoPago
import com.miempresa.mowimarket.data.model.Pedido
import com.miempresa.mowimarket.ui.theme.OrangePrimary
import com.miempresa.mowimarket.ui.viewmodel.PedidoViewModel
import com.miempresa.mowimarket.ui.viewmodel.PedidoViewModelFactory
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrderDetailScreen(
    orderId: Int,
    navController: NavController,
    pedidoViewModel: PedidoViewModel = viewModel(factory = PedidoViewModelFactory())
) {
    val pedido by pedidoViewModel.pedido.collectAsState()
    val isLoading by pedidoViewModel.isLoading.collectAsState()
    val error by pedidoViewModel.error.collectAsState()

    LaunchedEffect(orderId) {
        pedidoViewModel.loadPedido(orderId)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Pedido #${orderId}", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Volver")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = Color.White,
                    navigationIconContentColor = Color.White
                )
            )
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            when {
                isLoading -> {
                    CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
                }
                error != null -> {
                    Text(
                        text = error!!,
                        color = MaterialTheme.colorScheme.error,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.align(Alignment.Center).padding(16.dp)
                    )
                }
                pedido != null -> {
                    OrderDetailContent(pedido!!)
                }
                else -> {
                    Text(
                        text = "No se encontró el pedido.",
                        textAlign = TextAlign.Center,
                        modifier = Modifier.align(Alignment.Center).padding(16.dp)
                    )
                }
            }
        }
    }
}

@Composable
private fun OrderDetailContent(pedido: Pedido) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                        Text("Estado del Pedido", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                        EstadoBadge(estado = pedido.estado)
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.DateRange, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(formatearFechaDetalle(pedido.fechaPedido), fontSize = 14.sp)
                    }
                }
            }
        }

        item {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Información de Pago", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(12.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            when (pedido.metodoPago) {
                                MetodoPago.TARJETA -> Icons.Default.AccountBox
                                MetodoPago.YAPE -> Icons.Default.Phone
                                MetodoPago.TRANSFERENCIA -> Icons.Default.AccountBalance
                            },
                            contentDescription = null,
                            tint = OrangePrimary
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = when (pedido.metodoPago) {
                                MetodoPago.TARJETA -> "Tarjeta de Crédito/Débito"
                                MetodoPago.YAPE -> "Yape"
                                MetodoPago.TRANSFERENCIA -> "Transferencia Bancaria"
                            },
                            fontSize = 16.sp
                        )
                    }
                }
            }
        }

        item {
            Text(
                "Productos (${pedido.detalles.size})",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(vertical = 8.dp)
            )
        }

        items(pedido.detalles) { detalle ->
            DetalleProductoCard(detalle = detalle)
        }

        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Resumen del Pedido", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(16.dp))
                    pedido.detalles.forEach {
                        Row(Modifier.fillMaxWidth().padding(vertical = 4.dp), Arrangement.SpaceBetween) {
                            Text("${it.cantidad}x ${it.producto.nombre}", modifier = Modifier.weight(1f), fontSize = 14.sp)
                            Text("S/ %.2f".format(it.subtotal), fontSize = 14.sp, fontWeight = FontWeight.Medium)
                        }
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    Divider()
                    Spacer(modifier = Modifier.height(12.dp))
                    Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween, Alignment.CenterVertically) {
                        Text("Total", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                        Text(pedido.totalFormateado(), fontSize = 24.sp, fontWeight = FontWeight.ExtraBold, color = OrangePrimary)
                    }
                }
            }
        }
    }
}


@Composable
fun DetalleProductoCard(detalle: DetallePedido) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp)
        ) {
            AsyncImage(
                model = detalle.producto.imagenUrl,
                contentDescription = detalle.producto.nombre,
                modifier = Modifier
                    .size(80.dp)
                    .clip(RoundedCornerShape(12.dp)),
                contentScale = ContentScale.Crop
            )

            Spacer(modifier = Modifier.width(16.dp))

            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = detalle.producto.nombre,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Cantidad: ${detalle.cantidad}",
                    fontSize = 14.sp,
                    color = Color.Gray
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Precio: S/ %.2f".format(detalle.precioUnitario),
                    fontSize = 14.sp,
                    color = Color.Gray
                )
            }

            Text(
                text = "S/ %.2f".format(detalle.subtotal),
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = OrangePrimary
            )
        }
    }
}

private fun formatearFechaDetalle(fechaISO: String): String {
    return try {
        val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault())
        val outputFormat = SimpleDateFormat("dd MMMM yyyy, HH:mm", Locale("es", "ES"))
        val date = inputFormat.parse(fechaISO)
        date?.let { outputFormat.format(it).replaceFirstChar { it.uppercase() } } ?: fechaISO
    } catch (e: Exception) {
        fechaISO
    }
}
