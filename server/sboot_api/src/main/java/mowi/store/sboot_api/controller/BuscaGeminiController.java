package mowi.store.sboot_api.controller;

import mowi.store.sboot_api.service.BuscaGeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/busca-gemini")
@CrossOrigin(origins = "*")
public class BuscaGeminiController {

    @Autowired
    private BuscaGeminiService buscaGeminiService;

    /**
     * Endpoint: POST /api/busca-gemini/buscar
     * Búsqueda con IA REAL de Google Gemini
     *
     * Entiende lenguaje natural complejo:
     * - "laptop para programación bajo 500 dólares"
     * - "celular samsung de última generación con buena batería"
     * - "algo para trabajar desde casa económico"
     * - "productos en oferta para regalos"
     */
    @PostMapping("/buscar")
    public Map<String, Object> buscarConGemini(@RequestBody Map<String, String> request) {
        String consulta = request.get("consulta");

        BuscaGeminiService.BuscaGeminiResponse respuesta =
                buscaGeminiService.buscarConGemini(consulta);

        Map<String, Object> response = new HashMap<>();
        response.put("consulta", respuesta.consulta);
        response.put("resultados", respuesta.resultados);
        response.put("total", respuesta.total);
        response.put("mensaje", respuesta.mensaje);
        response.put("razonamientoIA", respuesta.razonamientoGemini);
        response.put("tipo", "GEMINI_AI"); // Indicador de que es IA real

        return response;
    }

    /**
     * Endpoint: GET /api/busca-gemini/sugerencias?q=laptop
     * Obtiene sugerencias mejoradas usando Gemini
     */
    @GetMapping("/sugerencias")
    public Map<String, Object> obtenerSugerenciasGemini(@RequestParam String q) {
        List<String> sugerencias = buscaGeminiService.obtenerSugerenciasConGemini(q);

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("consulta", q);
        respuesta.put("sugerencias", sugerencias);
        respuesta.put("tipo", "GEMINI_AI");

        return respuesta;
    }
}