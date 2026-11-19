
package com.jobmatcher.config;

import com.jobmatcher.security.TokenFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain chain(
            HttpSecurity http,
            TokenFilter filter,
            CorsConfigurationSource corsConfigurationSource
    ) throws Exception {

        return http
                .csrf(c -> c.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .headers(h -> h.frameOptions(f -> f.sameOrigin()))
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(a -> a
                        .requestMatchers(
                                "/api/hello",
                                "/api/auth/**",
                                "/api/jobs",
                                "/api/match",
                                "/api/resume/upload",
                                "/h2-console/**",
                                "/error"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    CorsConfigurationSource cors(
            @Value("${app.cors.allowed-origins}") String origins
    ) {
        CorsConfiguration c = new CorsConfiguration();

        c.setAllowedOrigins(
                Arrays.stream(origins.split(","))
                        .map(String::trim)
                        .toList()
        );

        c.setAllowedMethods(
                List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        );

        c.setAllowedHeaders(List.of("*"));
        c.setExposedHeaders(List.of("Authorization"));
        c.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource();
        s.registerCorsConfiguration("/**", c);

        return s;
    }
}
