package utez.edu.mx.nextsong.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 🔥 Configuramos CORS de forma explícita para que Android no sea bloqueado
                .cors(Customizer.withDefaults())

                // Deshabilitamos CSRF ya que es una API REST y no usa sesiones de navegador
                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth -> auth
                        // Mantenemos tu lógica original: permitir todas las rutas
                        // Pero dejamos lista la estructura por si en el futuro quieres asegurar alguna
                        .requestMatchers("/auth/**").permitAll()
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    // ✅ Bean necesario para que 'Customizer.withDefaults()' sepa a quién dejar pasar
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Permitimos peticiones desde cualquier origen (necesario para el emulador y dispositivos físicos)
        configuration.setAllowedOrigins(List.of("*"));

        // Permitimos todos los métodos HTTP que usa tu App
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Permitimos todos los encabezados (Headers)
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}