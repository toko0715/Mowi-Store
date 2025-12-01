package mowi.store.sboot_api.service;

import mowi.store.sboot_api.model.Producto;
import mowi.store.sboot_api.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BuscaGeminiService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    // ✅ MODELO VERIFICADO QUE FUNCIONA: gemini-2.0-flash
    // Lista completa: https://ai.google.dev/gemini-api/docs/models/gemini
    private static final String GEMINI_API_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    /**
     * Búsqueda con Gemini AI - usando modelo verificado
     */
    public BuscaGeminiResponse buscarConGemini(String consulta) {
        try {
            List<Producto> todosProductos = productoRepository.findAll();

            if (todosProductos.isEmpty()) {
                return new BuscaGeminiResponse(
                        consulta,
                        new ArrayList<>(),
                        null,
                        "⚠️ No hay productos en la base de datos"
                );
            }

            String datosProductos = formatearProductosParaGemini(todosProductos);
            String respuestaGemini = llamarGemini(consulta, datosProductos);
            List<Producto> resultados = extraerProductosDeLaRespuesta(respuestaGemini, todosProductos);

            return new BuscaGeminiResponse(
                    consulta,
                    resultados,
                    respuestaGemini,
                    "✅ Búsqueda realizada con Gemini AI (gemini-2.0-flash)"
            );

        } catch (Exception e) {
            e.printStackTrace();
            return new BuscaGeminiResponse(
                    consulta,
                    new ArrayList<>(),
                    null,
                    "❌ Error: " + e.getMessage()
            );
        }
    }

    /**
     * Llamar a Gemini con modelo verificado
     */
    private String llamarGemini(String consulta, String datosProductos) {
        try {
            String prompt = construirPrompt(consulta, datosProductos);

            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            List<Map<String, String>> parts = new ArrayList<>();

            Map<String, String> part = new HashMap<>();
            part.put("text", prompt);
            parts.add(part);

            content.put("parts", parts);
            List<Map<String, Object>> contents = new ArrayList<>();
            contents.add(content);
            requestBody.put("contents", contents);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            String url = GEMINI_API_URL + "?key=" + geminiApiKey;

            System.out.println("🔍 Llamando a Gemini: " + url.replace(geminiApiKey, "***KEY***"));

            Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);

            System.out.println("✅ Respuesta de Gemini recibida");

            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);

                    if (candidate.containsKey("content")) {
                        Map<String, Object> content_resp = (Map<String, Object>) candidate.get("content");
                        if (content_resp != null && content_resp.containsKey("parts")) {
                            List<Map<String, Object>> parts_resp = (List<Map<String, Object>>) content_resp.get("parts");
                            if (!parts_resp.isEmpty()) {
                                String texto = (String) parts_resp.get(0).get("text");
                                System.out.println("📝 Respuesta: " + texto);
                                return texto;
                            }
                        }
                    }
                }
            }

            return "";

        } catch (Exception e) {
            System.out.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error llamando a Gemini: " + e.getMessage());
        }
    }

    private String construirPrompt(String consulta, String datosProductos) {
        return "Eres un asistente de ecommerce. Usuario busca: \"" + consulta + "\"\n\n" +
                "Productos:\n" + datosProductos + "\n\n" +
                "Devuelve SOLO los IDs que coinciden (ej: 1,5,12) o 'sin_resultados'";
    }

    private String formatearProductosParaGemini(List<Producto> productos) {
        StringBuilder sb = new StringBuilder();
        for (Producto p : productos) {
            sb.append(String.format(
                    "ID:%d | %s | $%.2f | %s\n",
                    p.getId(),
                    p.getNombre(),
                    p.getPrecio(),
                    p.getCategoria() != null ? p.getCategoria().getNombre() : "N/A"
            ));
        }
        return sb.toString();
    }

    private List<Producto> extraerProductosDeLaRespuesta(String respuesta, List<Producto> todosProductos) {
        List<Producto> resultados = new ArrayList<>();

        if (respuesta == null || respuesta.trim().isEmpty() || respuesta.contains("sin_resultados")) {
            return resultados;
        }

        String[] ids = respuesta.trim().replaceAll("[^0-9,]", "").split(",");

        for (String id : ids) {
            try {
                Long productoId = Long.parseLong(id.trim());
                todosProductos.stream()
                        .filter(p -> p.getId().equals(productoId))
                        .findFirst()
                        .ifPresent(resultados::add);
            } catch (Exception e) {
                // Ignorar
            }
        }

        return resultados;
    }

    public List<String> obtenerSugerenciasConGemini(String consulta) {
        try {
            String respuesta = llamarGemini(consulta, "");
            List<String> sugerencias = new ArrayList<>();
            for (String linea : respuesta.split("\n")) {
                String s = linea.trim();
                if (!s.isEmpty() && sugerencias.size() < 5) {
                    sugerencias.add(s);
                }
            }
            return sugerencias;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public static class BuscaGeminiResponse {
        public String consulta;
        public List<Producto> resultados;
        public String razonamientoGemini;
        public String mensaje;
        public int total;

        public BuscaGeminiResponse(String consulta, List<Producto> resultados,
                                   String razonamientoGemini, String mensaje) {
            this.consulta = consulta;
            this.resultados = resultados != null ? resultados : new ArrayList<>();
            this.razonamientoGemini = razonamientoGemini;
            this.mensaje = mensaje;
            this.total = this.resultados.size();
        }
    }
}