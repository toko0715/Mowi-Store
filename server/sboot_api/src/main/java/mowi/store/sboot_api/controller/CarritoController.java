package mowi.store.sboot_api.controller;

import mowi.store.sboot_api.model.Carrito;
import mowi.store.sboot_api.model.ItemCarrito;
import mowi.store.sboot_api.service.CarritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/carrito")
@CrossOrigin(origins = "*")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    // GET /api/carrito - Obtener carrito del usuario
    @GetMapping
    public Carrito obtenerCarrito(@RequestParam Long usuarioId) {
        return carritoService.obtenerCarrito(usuarioId);
    }

    // POST /api/carrito/agregar - Agregar producto al carrito
    @PostMapping("/agregar")
    public ItemCarrito agregarAlCarrito(
            @RequestParam Long usuarioId,
            @RequestParam Long productoId,
            @RequestParam Integer cantidad) {

        return carritoService.agregarAlCarrito(usuarioId, productoId, cantidad);
    }

    // PUT /api/carrito/actualizar - Actualizar cantidad de producto
    @PutMapping("/actualizar")
    public ItemCarrito actualizarCantidad(
            @RequestParam Long usuarioId,
            @RequestParam Long productoId,
            @RequestParam Integer cantidad) {

        return carritoService.actualizarCantidad(usuarioId, productoId, cantidad);
    }

    // DELETE /api/carrito/eliminar/{itemId} - Eliminar producto del carrito
    @DeleteMapping("/eliminar/{itemId}")
    public Map<String, String> eliminarDelCarrito(
            @PathVariable Long itemId,
            @RequestParam Long usuarioId) {

        carritoService.eliminarDelCarrito(usuarioId, itemId);
        return Map.of("mensaje", "Producto eliminado del carrito");
    }

    // DELETE /api/carrito/limpiar - Limpiar todo el carrito
    @DeleteMapping("/limpiar")
    public Map<String, String> limpiarCarrito(@RequestParam Long usuarioId) {
        carritoService.limpiarCarrito(usuarioId);
        return Map.of("mensaje", "Carrito vaciado");
    }
}