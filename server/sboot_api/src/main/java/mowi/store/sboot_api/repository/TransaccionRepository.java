package mowi.store.sboot_api.repository;

import mowi.store.sboot_api.model.Transaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {

    // Buscar por ID de Stripe
    Optional<Transaccion> findByStripePaymentIntentId(String stripePaymentIntentId);

    // Buscar por ID de Pedido
    Optional<Transaccion> findByPedidoId(Long pedidoId);
}
