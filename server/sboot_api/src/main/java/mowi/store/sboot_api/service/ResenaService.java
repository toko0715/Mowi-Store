package mowi.store.sboot_api.service;

import mowi.store.sboot_api.model.Resena;
import mowi.store.sboot_api.repository.ResenaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ResenaService {

    @Autowired
    private ResenaRepository resenaRepository;

    // Obtener reseñas de un producto
    public List<Resena> obtenerResenas(Long productoId) {
        return resenaRepository.findByProductoId(productoId);
    }

    // Crear reseña
    public Resena crearResena(Resena resena) {
        if (resena.getCalificacion() < 1 || resena.getCalificacion() > 5) {
            throw new RuntimeException("La calificación debe estar entre 1 y 5");
        }

        return resenaRepository.save(resena);
    }

    // Obtener reseña por ID
    public Optional<Resena> obtenerResena(Long id) {
        return resenaRepository.findById(id);
    }

    // Eliminar reseña
    public void eliminarResena(Long id) {
        resenaRepository.deleteById(id);
    }
}