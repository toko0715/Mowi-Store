package mowi.store.sboot_api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacciones")
public class Transaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String stripePaymentIntentId;  // ID único de Stripe

    @Column(nullable = false)
    private Long pedidoId;  // FK a Pedido

    @Column(nullable = false)
    private Double monto;

    @Column(nullable = false)
    private String estado;  // PENDIENTE, EXITOSO, FALLIDO

    @Column(nullable = false)
    private String metodoPago;  // STRIPE

    @Column(nullable = true)
    private LocalDateTime fechaPago;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;

    private String detalleError;  // Mensaje de error si falla

    // Constructores
    public Transaccion() {
        this.fechaCreacion = LocalDateTime.now();
        this.metodoPago = "STRIPE";
        this.estado = "PENDIENTE";
    }

    public Transaccion(Long pedidoId, Double monto, String stripePaymentIntentId) {
        this();
        this.pedidoId = pedidoId;
        this.monto = monto;
        this.stripePaymentIntentId = stripePaymentIntentId;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStripePaymentIntentId() {
        return stripePaymentIntentId;
    }

    public void setStripePaymentIntentId(String stripePaymentIntentId) {
        this.stripePaymentIntentId = stripePaymentIntentId;
    }

    public Long getPedidoId() {
        return pedidoId;
    }

    public void setPedidoId(Long pedidoId) {
        this.pedidoId = pedidoId;
    }

    public Double getMonto() {
        return monto;
    }

    public void setMonto(Double monto) {
        this.monto = monto;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public LocalDateTime getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDateTime fechaPago) {
        this.fechaPago = fechaPago;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getDetalleError() {
        return detalleError;
    }

    public void setDetalleError(String detalleError) {
        this.detalleError = detalleError;
    }
}