package mowi.store.sboot_api.repository;

import mowi.store.sboot_api.model.ItemCarrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ItemCarritoRepository extends JpaRepository<ItemCarrito, Long> {

    List<ItemCarrito> findByCarrito_Id(Long carritoId);

    Optional<ItemCarrito> findByCarrito_IdAndProducto_Id(Long carritoId, Long productoId);

    void deleteByCarrito_Id(Long carritoId);
}
