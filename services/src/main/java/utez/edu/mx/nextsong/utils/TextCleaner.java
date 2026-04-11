package utez.edu.mx.nextsong.utils;

public class TextCleaner {

    /**
     * Limpia texto de artistas y títulos para mejorar coincidencia en APIs de letras.
     */
    public static String clean(String text) {
        if (text == null) return null;

        return text
                .replaceAll("\\(.*?\\)", "")   // (remaster, live, etc)
                .replaceAll("\\[.*?\\]", "")   // [remaster]
                .replace("feat.", "")
                .replace("ft.", "")
                .replace("Feat.", "")
                .replace("&", "and")
                .replaceAll("\\s+", " ")
                .trim();
    }
}