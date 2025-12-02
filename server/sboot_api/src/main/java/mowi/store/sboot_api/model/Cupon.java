package mowi.store.sboot_api.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "mowi_dashboard_cupon")
public class Cupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String codigo;

    @Column(nullable = false, length = 200)
    private String descripcion;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoDescuento tipoDescuento; // PORCENTAJE o MONTO_FIJO

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorDescuento;

    @Column(nullable = false)
    private BigDecimal montoMinimo; // Monto mínimo de compra para aplicar el cupón

    @Column(nullable = false)
    private Integer usosMaximos; // Número máximo de veces que se puede usar

    @Column(nullable = false)
    private Integer usosActuales = 0;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDateTime fechaFin;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    public enum TipoDescuento {
        PORCENTAJE,
        MONTO_FIJO
    }

    public Cupon() {}

    public Cupon(String codigo, String descripcion, TipoDescuento tipoDescuento,
                 BigDecimal valorDescuento, BigDecimal montoMinimo, Integer usosMaximos,
                 LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.tipoDescuento = tipoDescuento;
        this.valorDescuento = valorDescuento;
        this.montoMinimo = montoMinimo;
        this.usosMaximos = usosMaximos;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.activo = true;
        this.usosActuales = 0;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public TipoDescuento getTipoDescuento() { return tipoDescuento; }
    public void setTipoDescuento(TipoDescuento tipoDescuento) { this.tipoDescuento = tipoDescuento; }

    public BigDecimal getValorDescuento() { return valorDescuento; }
    public void setValorDescuento(BigDecimal valorDescuento) { this.valorDescuento = valorDescuento; }

    public BigDecimal getMontoMinimo() { return montoMinimo; }
    public void setMontoMinimo(BigDecimal montoMinimo) { this.montoMinimo = montoMinimo; }

    public Integer getUsosMaximos() { return usosMaximos; }
    public void setUsosMaximos(Integer usosMaximos) { this.usosMaximos = usosMaximos; }

    public Integer getUsosActuales() { return usosActuales; }
    public void setUsosActuales(Integer usosActuales) { this.usosActuales = usosActuales; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public LocalDateTime getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDateTime fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDateTime getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDateTime fechaFin) { this.fechaFin = fechaFin; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    // Método para calcular el descuento
    public BigDecimal calcularDescuento(BigDecimal montoTotal) {
        if (montoTotal.compareTo(montoMinimo) < 0) {
            return BigDecimal.ZERO;
        }

        if (tipoDescuento == TipoDescuento.PORCENTAJE) {
            return montoTotal.multiply(valorDescuento).divide(new BigDecimal("100"));
        } else {
            return valorDescuento.min(montoTotal);
        }
    }

    // Método para verificar si el cupón es válido
    public boolean esValido() {
        LocalDateTime ahora = LocalDateTime.now();
        return activo 
            && ahora.isAfter(fechaInicio) 
            && ahora.isBefore(fechaFin)
            && usosActuales < usosMaximos;
    }
}

