package mowi.store.sboot_api.service;

import mowi.store.sboot_api.model.Carrito;
import mowi.store.sboot_api.model.DetallePedido;
import mowi.store.sboot_api.model.ItemCarrito;
import mowi.store.sboot_api.model.Pedido;
import mowi.store.sboot_api.model.Producto;
import mowi.store.sboot_api.repository.DetallePedidoRepository;
import mowi.store.sboot_api.repository.ItemCarritoRepository; // <--- IMPORTANTE
import mowi.store.sboot_api.repository.PedidoRepository;
import mowi.store.sboot_api.repository.ProductoRepository; // <--- IMPORTANTE (Stock)
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <--- IMPORTANTE
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    @Autowired
    private CarritoService carritoService;

    @Autowired
    private ItemCarritoRepository itemCarritoRepository; // <--- INYECCIÓN NECESARIA

    @Autowired
    private ProductoRepository productoRepository; // <--- Para actualizar stock

    // Crear pedido desde carrito (versión segura sin cupones)
    @Transactional // <--- Asegura que todo ocurra en una transacción
    public Pedido crearPedidoDesdeCarrito(Long usuarioId, String metodoPago) {
        Carrito carrito = carritoService.obtenerCarrito(usuarioId);

        // --- SOLUCIÓN AL ERROR "CARRITO VACÍO" ---
        // Buscamos los ítems directamente en la base de datos usando el ID del carrito
        // Esto ignora cualquier problema de caché o lazy loading del objeto Carrito
        List<ItemCarrito> items = itemCarritoRepository.findByCarrito_Id(carrito.getId());

        if (items == null || items.isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }

        // Calcular total sumando los subtotales de los ítems reales
        BigDecimal total = items.stream()
                .map(ItemCarrito::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Crear pedido
        Pedido pedido = new Pedido(usuarioId, total, metodoPago);
        pedido.setEstado("PENDIENTE");
        pedido.setFechaPedido(LocalDateTime.now());
        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        // Procesar ítems: Crear detalles y actualizar stock
        for (ItemCarrito item : items) {
            // 1. Crear Detalle
            DetallePedido detalle = new DetallePedido(
                    pedidoGuardado,
                    item.getProducto(),
                    item.getCantidad(),
                    item.getProducto().getPrecio()
            );
            detallePedidoRepository.save(detalle);

            // 2. Actualizar Stock (Lógica básica importante)
            Producto producto = item.getProducto();
            if (producto.getStock() >= item.getCantidad()) {
                producto.setStock(producto.getStock() - item.getCantidad());
                producto.setVendidos(producto.getVendidos() + item.getCantidad());
                productoRepository.save(producto);
            }
        }

        // Limpiar carrito
        carritoService.limpiarCarrito(usuarioId);

        return pedidoGuardado;
    }

    // ... (El resto de tus métodos getter/setter siguen igual)
    
    public Optional<Pedido> obtenerPedido(Long id) {
        return pedidoRepository.findById(id);
    }

    public List<Pedido> listarPedidosUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId);
    }

    public List<DetallePedido> obtenerDetallesPedido(Long pedidoId) {
        return detallePedidoRepository.findByPedidoId(pedidoId);
    }

    public Pedido actualizarEstado(Long pedidoId, String nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        pedido.setEstado(nuevoEstado);
        pedido.setFechaActualizacion(LocalDateTime.now());

        return pedidoRepository.save(pedido);
    }
}