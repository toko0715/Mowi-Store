package mowi.store.sboot_api.controller;

import mowi.store.sboot_api.model.Resena;
import mowi.store.sboot_api.service.ResenaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resenas")
@CrossOrigin(origins = "*")
public class ResenaController {

    @Autowired
    private ResenaService resenaService;

    // GET /api/resenas/{productoId} - Obtener reseñas de un producto
    @GetMapping("/{productoId}")
    public List<Resena> obtenerResenas(@PathVariable Long productoId) {
        return resenaService.obtenerResenas(productoId);
    }

    // POST /api/resenas - Crear nueva reseña
    @PostMapping
    public Resena crearResena(@RequestBody Resena resena) {
        return resenaService.crearResena(resena);
    }

    // GET /api/resenas/detalle/{id} - Obtener reseña por ID
    @GetMapping("/detalle/{id}")
    public Resena obtenerResena(@PathVariable Long id) {
        return resenaService.obtenerResena(id)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));
    }

    // DELETE /api/resenas/{id} - Eliminar reseña
    @DeleteMapping("/{id}")
    public String eliminarResena(@PathVariable Long id) {
        resenaService.eliminarResena(id);
        return "Reseña eliminada";
    }
}