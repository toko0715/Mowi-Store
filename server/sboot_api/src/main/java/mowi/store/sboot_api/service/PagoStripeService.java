package mowi.store.sboot_api.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import mowi.store.sboot_api.model.Transaccion;
import mowi.store.sboot_api.model.Pedido;
import mowi.store.sboot_api.repository.TransaccionRepository;
import mowi.store.sboot_api.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PagoStripeService {

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private CarritoService carritoService;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    /**
     * Crear un Payment Intent en Stripe
     *
     * Retorna un objeto con:
     * - clientSecret: para enviar al frontend
     * - paymentIntentId: para guardar en BD
     */
    public PagoResponse crearPaymentIntent(Long pedidoId, Double monto) {
        try {
            // Inicializar Stripe con la API key
            Stripe.apiKey = stripeApiKey;

            // Convertir monto a centavos (Stripe usa centavos)
            Long montoEnCentavos = (long) (monto * 100);

            // Crear Payment Intent
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(montoEnCentavos)
                    .setCurrency("usd")  // Cambiar a "mxn" si usas pesos mexicanos
                    .setDescription("Pago de pedido #" + pedidoId)
                    .putMetadata("pedidoId", pedidoId.toString())
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            System.out.println("✅ Payment Intent creado: " + paymentIntent.getId());

            // Guardar en BD
            Transaccion transaccion = new Transaccion(pedidoId, monto, paymentIntent.getId());
            transaccionRepository.save(transaccion);

            // Retornar respuesta para el frontend
            PagoResponse response = new PagoResponse();
            response.setClientSecret(paymentIntent.getClientSecret());
            response.setPaymentIntentId(paymentIntent.getId());
            response.setMonto(monto);
            response.setMoneda("USD");
            response.setMensaje("✅ Payment Intent creado. Envía clientSecret al frontend.");

            return response;

        } catch (StripeException e) {
            System.out.println("❌ Error Stripe: " + e.getMessage());
            throw new RuntimeException("Error creando Payment Intent: " + e.getMessage());
        }
    }

    /**
     * Confirmar pago (después que el frontend lo procesó)
     */
    public Map<String, Object> confirmarPago(String paymentIntentId) {
        try {
            Stripe.apiKey = stripeApiKey;

            // Obtener el Payment Intent de Stripe
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);

            Map<String, Object> respuesta = new HashMap<>();

            // Verificar estado
            if ("succeeded".equals(paymentIntent.getStatus())) {
                // Pago exitoso
                Optional<Transaccion> transOpt = transaccionRepository.findByStripePaymentIntentId(paymentIntentId);

                if (transOpt.isPresent()) {
                    Transaccion trans = transOpt.get();
                    trans.setEstado("EXITOSO");
                    trans.setFechaPago(LocalDateTime.now());
                    transaccionRepository.save(trans);

                    // Limpiar carrito del usuario asociado al pedido
                    Pedido pedido = pedidoRepository.findById(trans.getPedidoId())
                            .orElse(null);
                    if (pedido != null) {
                        try {
                            carritoService.limpiarCarrito(pedido.getUsuarioId());
                        } catch (Exception e) {
                            // Ignorar errores al limpiar el carrito: no bloquear confirmación
                        }
                    }

                    respuesta.put("estado", "EXITOSO");
                    respuesta.put("mensaje", "✅ Pago procesado exitosamente");
                    respuesta.put("pedidoId", trans.getPedidoId());
                    respuesta.put("monto", trans.getMonto());
                }

            } else if ("processing".equals(paymentIntent.getStatus())) {
                respuesta.put("estado", "PROCESANDO");
                respuesta.put("mensaje", "⏳ Pago en proceso");

            } else if ("requires_payment_method".equals(paymentIntent.getStatus())) {
                respuesta.put("estado", "PENDIENTE");
                respuesta.put("mensaje", "⏸️ Requiere método de pago");

            } else {
                respuesta.put("estado", "FALLIDO");
                respuesta.put("mensaje", "❌ Pago fallido");
            }

            return respuesta;

        } catch (StripeException e) {
            System.out.println("❌ Error confirmando pago: " + e.getMessage());
            throw new RuntimeException("Error confirmando pago: " + e.getMessage());
        }
    }

    /**
     * Obtener estado de un pago
     */
    public Map<String, Object> obtenerEstadoPago(Long pedidoId) {
        Optional<Transaccion> transOpt = transaccionRepository.findByPedidoId(pedidoId);

        Map<String, Object> respuesta = new HashMap<>();

        if (transOpt.isPresent()) {
            Transaccion trans = transOpt.get();
            respuesta.put("estado", trans.getEstado());
            respuesta.put("monto", trans.getMonto());
            respuesta.put("pedidoId", trans.getPedidoId());
            respuesta.put("fechaPago", trans.getFechaPago());
            respuesta.put("metodoPago", trans.getMetodoPago());
        } else {
            respuesta.put("error", "No hay pago registrado para este pedido");
        }

        return respuesta;
    }

    /**
     * Clase para respuesta de Payment Intent
     */
    public static class PagoResponse {
        private String clientSecret;
        private String paymentIntentId;
        private Double monto;
        private String moneda;
        private String mensaje;

        public PagoResponse() {}

        // Getters y Setters
        public String getClientSecret() {
            return clientSecret;
        }

        public void setClientSecret(String clientSecret) {
            this.clientSecret = clientSecret;
        }

        public String getPaymentIntentId() {
            return paymentIntentId;
        }

        public void setPaymentIntentId(String paymentIntentId) {
            this.paymentIntentId = paymentIntentId;
        }

        public Double getMonto() {
            return monto;
        }

        public void setMonto(Double monto) {
            this.monto = monto;
        }

        public String getMoneda() {
            return moneda;
        }

        public void setMoneda(String moneda) {
            this.moneda = moneda;
        }

        public String getMensaje() {
            return mensaje;
        }

        public void setMensaje(String mensaje) {
            this.mensaje = mensaje;
        }
    }
}
