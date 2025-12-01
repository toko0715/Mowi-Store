package mowi.store.sboot_api.service;

import mowi.store.sboot_api.model.Producto;
import mowi.store.sboot_api.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    // Listar todos los productos activos
    public List<Producto> listarProductos() {
        return productoRepository.findProductosActivos();
    }

    // Obtener producto por ID
    public Optional<Producto> obtenerProducto(Long id) {
        return productoRepository.findById(id);
    }

    // Buscar productos por nombre
    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.buscarPorNombre(nombre);
    }

    // Listar productos por categoría
    public List<Producto> productosPorCategoria(Long categoriaId) {
        return productoRepository.findByCategoria(categoriaId);
    }

    // Búsqueda general (por nombre o categoría)
    public List<Producto> buscar(String busqueda) {
        return productoRepository.buscar(busqueda);
    }

    // Obtener productos más vendidos
    public List<Producto> productosTop() {
        return productoRepository.findProductosActivos();
    }
}