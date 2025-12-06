package com.miempresa.mowimarket.ui.screens.user

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import coil.compose.AsyncImage
import com.miempresa.mowimarket.navigation.Routes
import com.miempresa.mowimarket.ui.viewmodel.CartViewModel
import com.miempresa.mowimarket.ui.viewmodel.ProductDetailUiState
import com.miempresa.mowimarket.ui.viewmodel.ProductViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProductDetailScreen(
    productId: Int,
    navController: NavController,
    isAuthenticated: Boolean,
    onLoginRequired: () -> Unit,
    viewModel: ProductViewModel = viewModel(),
    cartViewModel: CartViewModel = viewModel()
) {
    // Cargar producto al iniciar
    LaunchedEffect(productId) {
        viewModel.loadProductDetail(productId)
    }

    val productState by viewModel.productDetailState.collectAsState()
    var showLoginDialog by remember { mutableStateOf(false) }
    var showAddedToCartDialog by remember { mutableStateOf(false) }
    var quantity by remember { mutableStateOf(1) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Detalle del Producto") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Volver")
                    }
                }
            )
        }
    ) { padding ->
        when (val state = productState) {
            is ProductDetailUiState.Loading -> {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
            is ProductDetailUiState.Error -> {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            Icons.Default.Warning,
                            contentDescription = null,
                            modifier = Modifier.size(64.dp),
                            tint = MaterialTheme.colorScheme.error
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(state.message)
                    }
                }
            }
            is ProductDetailUiState.Success -> {
                val producto = state.product

                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                        .verticalScroll(rememberScrollState())
                ) {
                    // Imagen del producto
                    AsyncImage(
                        model = producto.imagen,
                        contentDescription = producto.nombre,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(300.dp),
                        contentScale = ContentScale.Crop
                    )

                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {
                        // Nombre
                        Text(
                            text = producto.nombre,
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.Bold
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        // Categoría
                        producto.categoria?.let {
                            Text(
                                text = it.nombre,
                                style = MaterialTheme.typography.bodyLarge,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Precio
                        Text(
                            text = producto.precioFormateado(),
                            style = MaterialTheme.typography.displaySmall,
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.Bold
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        // Stock
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                Icons.Default.ShoppingCart,
                                contentDescription = null,
                                tint = if (producto.stock > 0)
                                    MaterialTheme.colorScheme.primary
                                else
                                    MaterialTheme.colorScheme.error
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = if (producto.stock > 0)
                                    "Stock disponible: ${producto.stock}"
                                else
                                    "Agotado",
                                style = MaterialTheme.typography.bodyLarge,
                                color = if (producto.stock > 0)
                                    MaterialTheme.colorScheme.onSurface
                                else
                                    MaterialTheme.colorScheme.error
                            )
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        Divider()

                        Spacer(modifier = Modifier.height(16.dp))

                        // Descripción
                        Text(
                            text = "Descripción",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = producto.descripcion,
                            style = MaterialTheme.typography.bodyLarge,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )

                        Spacer(modifier = Modifier.height(32.dp))

                        // Selector de cantidad
                        Text(
                            text = "Cantidad",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            // Botón disminuir
                            OutlinedButton(
                                onClick = {
                                    if (quantity > 1) quantity--
                                },
                                enabled = quantity > 1,
                                modifier = Modifier.size(48.dp)
                            ) {
                                Icon(Icons.Default.Clear, contentDescription = "Disminuir")
                            }

                            Spacer(modifier = Modifier.width(16.dp))

                            // Cantidad
                            Text(
                                text = quantity.toString(),
                                style = MaterialTheme.typography.headlineMedium,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.weight(1f)
                            )

                            Spacer(modifier = Modifier.width(16.dp))

                            // Botón aumentar
                            OutlinedButton(
                                onClick = {
                                    if (quantity < producto.stock) quantity++
                                },
                                enabled = quantity < producto.stock,
                                modifier = Modifier.size(48.dp)
                            ) {
                                Icon(Icons.Default.Add, contentDescription = "Aumentar")
                            }
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        // Botón agregar al carrito
                        Button(
                            onClick = {
                                if (isAuthenticated) {
                                    cartViewModel.addToCart(producto, quantity)
                                    showAddedToCartDialog = true
                                } else {
                                    showLoginDialog = true
                                }
                            },
                            modifier = Modifier.fillMaxWidth(),
                            enabled = producto.stock > 0
                        ) {
                            Icon(Icons.Default.ShoppingCart, contentDescription = null)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Agregar al Carrito")
                        }
                    }
                }
            }
        }
    }

    // Dialog para pedir login
    if (showLoginDialog) {
        AlertDialog(
            onDismissRequest = { showLoginDialog = false },
            icon = { Icon(Icons.Default.Lock, contentDescription = null) },
            title = { Text("Iniciar Sesión") },
            text = { Text("Debes iniciar sesión para agregar productos al carrito") },
            confirmButton = {
                TextButton(
                    onClick = {
                        showLoginDialog = false
                        onLoginRequired()
                    }
                ) {
                    Text("Iniciar Sesión")
                }
            },
            dismissButton = {
                TextButton(onClick = { showLoginDialog = false }) {
                    Text("Cancelar")
                }
            }
        )
    }

    // Dialog después de agregar al carrito
    if (showAddedToCartDialog) {
        AlertDialog(
            onDismissRequest = { showAddedToCartDialog = false },
            icon = { Icon(Icons.Default.CheckCircle, contentDescription = null) },
            title = { Text("¡Producto Agregado!") },
            text = { Text("$quantity ${if (quantity == 1) "producto agregado" else "productos agregados"} al carrito") },
            confirmButton = {
                Button(
                    onClick = {
                        showAddedToCartDialog = false
                        navController.navigate(Routes.Cart.route)
                    }
                ) {
                    Text("Ir a Comprar")
                }
            },
            dismissButton = {
                TextButton(
                    onClick = {
                        showAddedToCartDialog = false
                        quantity = 1 // Resetear cantidad
                    }
                ) {
                    Text("Seguir Comprando")
                }
            }
        )
    }
}
