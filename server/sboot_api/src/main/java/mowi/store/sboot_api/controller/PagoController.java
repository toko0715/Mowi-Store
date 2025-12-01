package mowi.store.sboot_api.controller;

import mowi.store.sboot_api.service.PagoStripeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
@CrossOrigin(origins = "*")
public class PagoController {

    @Autowired
    private PagoStripeService pagoStripeService;

    /**
     * Endpoint: POST /api/pagos/crear-payment-intent
     *
     * Crear un Payment Intent en Stripe
     *
     * Request:
     * {
     *   "pedidoId": 1,
     *   "monto": 99.99
     * }
     *
     * Response:
     * {
     *   "clientSecret": "pi_xxxxx_secret_xxxxx",
     *   "paymentIntentId": "pi_xxxxx",
     *   "monto": 99.99,
     *   "moneda": "USD",
     *   "mensaje": "✅ Payment Intent creado..."
     * }
     */
    @PostMapping("/crear-payment-intent")
    public PagoStripeService.PagoResponse crearPaymentIntent(@RequestBody Map<String, Object> request) {
        Long pedidoId = ((Number) request.get("pedidoId")).longValue();
        Double monto = ((Number) request.get("monto")).doubleValue();

        System.out.println("📝 Creando Payment Intent para pedido: " + pedidoId + ", monto: $" + monto);

        return pagoStripeService.crearPaymentIntent(pedidoId, monto);
    }

    /**
     * Endpoint: POST /api/pagos/confirmar
     *
     * Confirmar que el pago fue procesado en Stripe
     *
     * Request:
     * {
     *   "paymentIntentId": "pi_xxxxx"
     * }
     *
     * Response:
     * {
     *   "estado": "EXITOSO",
     *   "mensaje": "✅ Pago procesado exitosamente",
     *   "pedidoId": 1,
     *   "monto": 99.99
     * }
     */
    @PostMapping("/confirmar")
    public Map<String, Object> confirmarPago(@RequestBody Map<String, String> request) {
        String paymentIntentId = request.get("paymentIntentId");

        System.out.println("✅ Confirmando pago: " + paymentIntentId);

        return pagoStripeService.confirmarPago(paymentIntentId);
    }

    /**
     * Endpoint: GET /api/pagos/estado/{pedidoId}
     *
     * Obtener estado del pago de un pedido
     *
     * Response:
     * {
     *   "estado": "EXITOSO",
     *   "monto": 99.99,
     *   "pedidoId": 1,
     *   "fechaPago": "2025-11-30T18:30:00",
     *   "metodoPago": "STRIPE"
     * }
     */
    @GetMapping("/estado/{pedidoId}")
    public Map<String, Object> obtenerEstadoPago(@PathVariable Long pedidoId) {
        System.out.println("🔍 Consultando estado de pago para pedido: " + pedidoId);

        return pagoStripeService.obtenerEstadoPago(pedidoId);
    }

    /**
     * ==================== ENDPOINT DE PRUEBA ====================
     *
     * Endpoint: POST /api/pagos/confirmar-prueba
     *
     * ⚠️ SOLO PARA DESARROLLO/TESTING
     *
     * Este endpoint simula lo que hace el frontend.
     * Confirma automáticamente el pago en Stripe (sin usuario).
     *
     * Request:
     * {
     *   "paymentIntentId": "pi_xxxxx"
     * }
     *
     * Response (si es exitoso):
     * {
     *   "estado": "EXITOSO",
     *   "mensaje": "✅ Pago confirmado (PRUEBA)",
     *   "pedidoId": 1,
     *   "monto": 99.99
     * }
     *
     * CÓMO USAR:
     * 1. POST /api/pagos/crear-payment-intent
     *    - Guarda el paymentIntentId
     *
     * 2. POST /api/pagos/confirmar-prueba
     *    - Usa el paymentIntentId del paso 1
     *    - Confirma automáticamente el pago
     *
     * 3. GET /api/pagos/estado/{pedidoId}
     *    - Verifica que esté EXITOSO
     */
    @PostMapping("/confirmar-prueba")
    public Map<String, Object> confirmarPrueba(@RequestBody Map<String, String> request) {
        String paymentIntentId = request.get("paymentIntentId");

        System.out.println("🧪 [PRUEBA] Confirmando pago: " + paymentIntentId);

        // Confirmar el pago
        Map<String, Object> respuesta = pagoStripeService.confirmarPago(paymentIntentId);

        // Agregar nota de que es prueba
        respuesta.put("tipo", "PRUEBA - Solo para desarrollo");
        respuesta.put("nota", "Este endpoint no debe usarse en producción");

        return respuesta;
    }
}