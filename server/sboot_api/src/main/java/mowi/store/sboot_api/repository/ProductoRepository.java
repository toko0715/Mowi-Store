package mowi.store.sboot_api.repository;


import mowi.store.sboot_api.model.Categoria;
import mowi.store.sboot_api.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByCategoria(Categoria categoria);

    @Query("SELECT p FROM Producto p WHERE p.nombre LIKE %:nombre% AND p.activo = true")
    List<Producto> buscarPorNombre(@Param("nombre") String nombre);

    @Query("SELECT p FROM Producto p WHERE p.activo = true ORDER BY p.vendidos DESC")
    List<Producto> findProductosActivos();

    @Query("SELECT p FROM Producto p WHERE p.categoria.id = :categoriaId AND p.activo = true")
    List<Producto> findByCategoria(@Param("categoriaId") Long categoriaId);

    @Query("SELECT p FROM Producto p WHERE p.nombre LIKE %:busqueda% OR p.categoria.nombre LIKE %:busqueda%")
    List<Producto> buscar(@Param("busqueda") String busqueda);
}