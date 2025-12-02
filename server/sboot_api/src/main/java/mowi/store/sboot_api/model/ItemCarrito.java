package mowi.store.sboot_api.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime; // Necesario para las fechas
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "mowi_dashboard_itemcarrito")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ItemCarrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "carrito_id", nullable = false)
    @JsonBackReference
    private Carrito carrito;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;

    // --- CORRECCIÓN CRÍTICA: HACER SUBTOTAL PERSISTENTE ---
    // (Anteriormente era @Transient, lo que causaba el error 1364)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal; // <-- AHORA ES UNA COLUMNA PERSISTENTE
    // -----------------------------------------------------

    // --- CAMPOS DE FECHA AÑADIDOS ---
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion", nullable = false)
    private LocalDateTime fechaActualizacion;
    // --------------------------------

    // Callbacks de persistencia para manejar las fechas
    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }


    public ItemCarrito() {}

    public ItemCarrito(Carrito carrito, Producto producto, Integer cantidad) {
        this.carrito = carrito;
        this.producto = producto;
        this.cantidad = cantidad;
        
        // --- CÁLCULO EN EL CONSTRUCTOR ANTES DE GUARDAR ---
        // Esto asegura que el campo persistente 'subtotal' tenga un valor no nulo
        this.subtotal = producto.getPrecio().multiply(new BigDecimal(cantidad));
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Carrito getCarrito() { return carrito; }
    public void setCarrito(Carrito carrito) { this.carrito = carrito; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
        // NOTA: Idealmente, aquí también recalcularías el subtotal y harías un setSubtotal()
    }

    // Getter para subtotal - Ahora devuelve el campo persistente
    public BigDecimal getSubtotal() {
        // Aunque se calcula al inicio, lo mantenemos como un campo persistente para INSERT/UPDATE
        return subtotal;
    }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    
    // Getters y Setters para las fechas
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}