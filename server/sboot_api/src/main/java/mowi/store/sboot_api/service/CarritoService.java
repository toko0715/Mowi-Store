package mowi.store.sboot_api.service;

import mowi.store.sboot_api.model.Carrito;
import mowi.store.sboot_api.model.ItemCarrito;
import mowi.store.sboot_api.model.Producto;
import mowi.store.sboot_api.repository.CarritoRepository;
import mowi.store.sboot_api.repository.ItemCarritoRepository;
import mowi.store.sboot_api.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <--- IMPORTANTE: Asegúrate de tener este import
import java.util.Optional;

@Service
public class CarritoService {

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private ItemCarritoRepository itemCarritoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    // Obtener o crear carrito del usuario
    public Carrito obtenerOCrearCarrito(Long usuarioId) {
        Optional<Carrito> carritoOpt = carritoRepository.findByUsuarioId(usuarioId);

        if (carritoOpt.isEmpty()) {
            Carrito nuevoCarrito = new Carrito(usuarioId);
            return carritoRepository.save(nuevoCarrito);
        }

        return carritoOpt.get();
    }

    // Agregar producto al carrito
    @Transactional
    public ItemCarrito agregarAlCarrito(Long usuarioId, Long productoId, Integer cantidad) {
        Carrito carrito = obtenerOCrearCarrito(usuarioId);
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Verificar si el producto ya está en el carrito
        Optional<ItemCarrito> itemExistente = itemCarritoRepository
                .findByCarrito_IdAndProducto_Id(carrito.getId(), productoId);

        if (itemExistente.isPresent()) {
            ItemCarrito item = itemExistente.get();
            item.setCantidad(item.getCantidad() + cantidad);
            return itemCarritoRepository.save(item);
        }

        // Crear nuevo item
        ItemCarrito nuevoItem = new ItemCarrito(carrito, producto, cantidad);
        return itemCarritoRepository.save(nuevoItem);
    }

    // Actualizar cantidad de producto en carrito
    @Transactional
    public ItemCarrito actualizarCantidad(Long usuarioId, Long productoId, Integer cantidad) {
        Carrito carrito = obtenerOCrearCarrito(usuarioId);
        ItemCarrito item = itemCarritoRepository
                .findByCarrito_IdAndProducto_Id(carrito.getId(), productoId)
                .orElseThrow(() -> new RuntimeException("Item no encontrado en el carrito"));

        if (cantidad <= 0) {
            itemCarritoRepository.delete(item);
            throw new RuntimeException("Cantidad inválida");
        }

        item.setCantidad(cantidad);
        return itemCarritoRepository.save(item);
    }

    // Eliminar producto del carrito
    @Transactional
    public void eliminarDelCarrito(Long usuarioId, Long itemId) {
        ItemCarrito item = itemCarritoRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));

        // Validar que pertenece al carrito del usuario
        if (!item.getCarrito().getUsuarioId().equals(usuarioId)) {
            throw new RuntimeException("Acceso denegado");
        }

        itemCarritoRepository.delete(item);
    }

    // Obtener carrito del usuario - CORREGIDO
    @Transactional // Mantenemos @Transactional para la sesión de DB
    public Carrito obtenerCarrito(Long usuarioId) {
        // ELIMINAMOS la carga manual y el setItems que causaban el error de Hibernate.
        // Gracias a FetchType.EAGER en el modelo Carrito, los items se cargan solos.
        return obtenerOCrearCarrito(usuarioId);
    }

    // Limpiar carrito (después de pago)
    @Transactional
    public void limpiarCarrito(Long usuarioId) {
        Optional<Carrito> carritoOpt = carritoRepository.findByUsuarioId(usuarioId);
        if (carritoOpt.isPresent()) {
            Carrito carrito = carritoOpt.get();
            itemCarritoRepository.deleteByCarrito_Id(carrito.getId());
            if (carrito.getItems() != null) {
                carrito.getItems().clear();
            }
        }
    }
}