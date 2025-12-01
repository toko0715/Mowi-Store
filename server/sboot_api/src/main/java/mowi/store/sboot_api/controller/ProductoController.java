package mowi.store.sboot_api.controller;

import mowi.store.sboot_api.model.Producto;
import mowi.store.sboot_api.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // GET /api/productos - Listar todos los productos
    @GetMapping
    public List<Producto> listarProductos(
            @RequestParam(required = false) String busqueda,
            @RequestParam(required = false) Long categoriaId) {

        if (busqueda != null && !busqueda.isEmpty()) {
            return productoService.buscar(busqueda);
        }

        if (categoriaId != null) {
            return productoService.productosPorCategoria(categoriaId);
        }

        return productoService.listarProductos();
    }

    // GET /api/productos/{id} - Obtener producto por ID
    @GetMapping("/{id}")
    public Producto obtenerProducto(@PathVariable Long id) {
        return productoService.obtenerProducto(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    // GET /api/productos/search/nombre - Buscar por nombre
    @GetMapping("/search/nombre")
    public List<Producto> buscarPorNombre(@RequestParam String nombre) {
        return productoService.buscarPorNombre(nombre);
    }

    // GET /api/productos/categoria/{categoriaId} - Productos por categoría
    @GetMapping("/categoria/{categoriaId}")
    public List<Producto> productosPorCategoria(@PathVariable Long categoriaId) {
        return productoService.productosPorCategoria(categoriaId);
    }

    // GET /api/productos/top - Productos más vendidos
    @GetMapping("/top/vendidos")
    public List<Producto> productosTop() {
        return productoService.productosTop();
    }
}