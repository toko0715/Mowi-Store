package mowi.store.sboot_api.service;

import mowi.store.sboot_api.model.Carrito;
import mowi.store.sboot_api.model.DetallePedido;
import mowi.store.sboot_api.model.ItemCarrito;
import mowi.store.sboot_api.model.Pedido;
import mowi.store.sboot_api.repository.DetallePedidoRepository;
import mowi.store.sboot_api.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

    // Crear pedido desde carrito
    public Pedido crearPedidoDesdeCarrito(Long usuarioId, String metodoPago) {
        Carrito carrito = carritoService.obtenerCarrito(usuarioId);

        if (carrito.getItems() == null || carrito.getItems().isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }

        BigDecimal total = carrito.getTotal();

        // Crear pedido
        Pedido pedido = new Pedido(usuarioId, total, metodoPago);
        pedido.setEstado("PENDIENTE");
        pedido.setFechaPedido(LocalDateTime.now());
        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        // Crear detalles del pedido desde items del carrito
        for (ItemCarrito item : carrito.getItems()) {
            DetallePedido detalle = new DetallePedido(
                    pedidoGuardado,
                    item.getProducto(),
                    item.getCantidad(),
                    item.getProducto().getPrecio()
            );
            detallePedidoRepository.save(detalle);
        }

        // Limpiar carrito
        carritoService.limpiarCarrito(usuarioId);

        return pedidoGuardado;
    }

    // Obtener pedido por ID
    public Optional<Pedido> obtenerPedido(Long id) {
        return pedidoRepository.findById(id);
    }

    // Listar pedidos del usuario
    public List<Pedido> listarPedidosUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId);
    }

    // Obtener detalles del pedido
    public List<DetallePedido> obtenerDetallesPedido(Long pedidoId) {
        return detallePedidoRepository.findByPedidoId(pedidoId);
    }

    // Actualizar estado del pedido
    public Pedido actualizarEstado(Long pedidoId, String nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        pedido.setEstado(nuevoEstado);
        pedido.setFechaActualizacion(LocalDateTime.now());

        return pedidoRepository.save(pedido);
    }
}