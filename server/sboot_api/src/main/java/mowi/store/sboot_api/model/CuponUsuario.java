package mowi.store.sboot_api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mowi_dashboard_cupon_usuario")
public class CuponUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @ManyToOne
    @JoinColumn(name = "cupon_id", nullable = false)
    private Cupon cupon;

    @Column(name = "fecha_uso", nullable = false)
    private LocalDateTime fechaUso = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = true)
    private Pedido pedido; // Pedido en el que se usó el cupón

    public CuponUsuario() {}

    public CuponUsuario(Long usuarioId, Cupon cupon, Pedido pedido) {
        this.usuarioId = usuarioId;
        this.cupon = cupon;
        this.pedido = pedido;
        this.fechaUso = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public Cupon getCupon() { return cupon; }
    public void setCupon(Cupon cupon) { this.cupon = cupon; }

    public LocalDateTime getFechaUso() { return fechaUso; }
    public void setFechaUso(LocalDateTime fechaUso) { this.fechaUso = fechaUso; }

    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }
}

