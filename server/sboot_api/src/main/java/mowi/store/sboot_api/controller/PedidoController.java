package mowi.store.sboot_api.controller;

import mowi.store.sboot_api.model.DetallePedido;
import mowi.store.sboot_api.model.Pedido;
import mowi.store.sboot_api.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    // POST /api/pago - Procesar pago simulado y crear pedido
    @PostMapping("/pago")
    public Pedido procesarPago(
            @RequestParam Long usuarioId,
            @RequestParam String metodoPago) {

        return pedidoService.crearPedidoDesdeCarrito(usuarioId, metodoPago);
    }

    // GET /api/pedidos - Listar pedidos del usuario
    @GetMapping
    public List<Pedido> listarPedidosUsuario(@RequestParam Long usuarioId) {
        return pedidoService.listarPedidosUsuario(usuarioId);
    }

    // GET /api/pedidos/{id} - Obtener detalle del pedido
    @GetMapping("/{id}")
    public Map<String, Object> obtenerDetallePedido(@PathVariable Long id) {
        Pedido pedido = pedidoService.obtenerPedido(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        List<DetallePedido> detalles = pedidoService.obtenerDetallesPedido(id);

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("pedido", pedido);
        respuesta.put("detalles", detalles);

        return respuesta;
    }

    // GET /api/pedidos/usuario/{usuarioId} - Listar todos los pedidos del usuario
    @GetMapping("/usuario/{usuarioId}")
    public List<Pedido> obtenerPedidosUsuario(@PathVariable Long usuarioId) {
        return pedidoService.listarPedidosUsuario(usuarioId);
    }

    // PUT /api/pedidos/{id}/estado - Actualizar estado del pedido
    @PutMapping("/{id}/estado")
    public Pedido actualizarEstado(
            @PathVariable Long id,
            @RequestParam String nuevoEstado) {

        return pedidoService.actualizarEstado(id, nuevoEstado);
    }
}