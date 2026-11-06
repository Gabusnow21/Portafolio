package com.dev.gabus.portafolioback.config;

import com.dev.gabus.portafolioback.model.entity.AdminUser;
import com.dev.gabus.portafolioback.model.entity.Project;
import com.dev.gabus.portafolioback.model.entity.Technology;
import com.dev.gabus.portafolioback.model.enums.ProjectStatus;
import com.dev.gabus.portafolioback.model.enums.ProjectType;
import com.dev.gabus.portafolioback.repository.AdminUserRepository;
import com.dev.gabus.portafolioback.repository.ProjectRepository;
import com.dev.gabus.portafolioback.repository.TechnologyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final ProjectRepository projectRepository;
    private final TechnologyRepository technologyRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedCatalog();
    }

    private void seedAdmin() {
        if (adminUserRepository.existsByEmail("dngabu123@gmail.com")) {
            return;
        }
        AdminUser admin = AdminUser.builder()
                .username("gabus")
                .email("dngabu123@gmail.com")
                .passwordHash(passwordEncoder.encode("valardohaeris2194"))
                .role("ADMIN")
                .enabled(true)
                .build();
        adminUserRepository.save(admin);
        log.info("Seed de usuario admin completado: {}", admin.getEmail());
    }

    private void seedCatalog() {
        Map<String, Technology> techs = createTechnologies();
        createProjects(techs);
    }

    private Map<String, Technology> createTechnologies() {
        Map<String, Technology> techs = new LinkedHashMap<>();

        techs.put("Angular", technology("Angular", "frontend", "angular.svg", "#DD0031"));
        techs.put("Spring", technology("Spring Boot", "backend", "spring.svg", "#6DB33F"));
        techs.put("Java", technology("Java", "backend", "java.svg", "#E76F00"));
        techs.put("PostgreSQL", technology("PostgreSQL", "db", "postgres.svg", "#336791"));
        techs.put("Docker", technology("Docker", "devops", "docker.svg", "#2496ED"));
        techs.put("Android", technology("Android", "mobile", "android.svg", "#3DDC84"));
        techs.put("Kotlin", technology("Kotlin", "mobile", "kotlin.svg", "#7F52FF"));
        techs.put("TypeScript", technology("TypeScript", "frontend", "typescript.svg", "#3178C6"));

        Map<String, Technology> saved = new LinkedHashMap<>();
        techs.forEach((key, t) -> saved.put(
                key,
                technologyRepository.findByNameIgnoreCase(t.getName()).orElseGet(() -> technologyRepository.save(t))));
        return saved;
    }

    private Technology technology(String name, String category, String icon, String color) {
        return Technology.builder()
                .name(name)
                .category(category)
                .icon(icon)
                .color(color)
                .build();
    }

    private void createProjects(Map<String, Technology> techs) {
        createProject(Project.builder()
                .title("Portafolio Web Profesional")
                .slug("portafolio-web-profesional")
                .shortDescription("Vitrina de proyectos web y móviles con panel de administración")
                .description("Aplicación de portafolio construida con Angular 20 y Spring Boot 4 que expone "
                        + "proyectos web y móviles, con panel de administración seguro, métricas y formulario de contacto.")
                .type(ProjectType.WEB)
                .status(ProjectStatus.MAINTAINED)
                .featured(true)
                .repoUrl("https://github.com/Gabusnow21/Portafolio")
                .startDate(LocalDate.of(2026, 8, 1))
                .viewsCount(120)
                .technologies(Set.of(
                        techs.get("Angular"),
                        techs.get("Spring"),
                        techs.get("Java"),
                        techs.get("PostgreSQL"),
                        techs.get("Docker")))
                .build());

        createProject(Project.builder()
                .title("App Meteorológica")
                .slug("app-meteorologica")
                .shortDescription("Consulta el clima en tiempo real desde tu dispositivo Android")
                .description("Aplicación móvil Android desarrollada en Kotlin que consume la API de OpenWeatherMap "
                        + "para mostrar el pronóstico del tiempo con actualización en tiempo real.")
                .type(ProjectType.MOBILE)
                .status(ProjectStatus.COMPLETED)
                .featured(true)
                .repoUrl("https://github.com/Gabusnow21/App-Meteorologica")
                .startDate(LocalDate.of(2025, 11, 15))
                .endDate(LocalDate.of(2026, 2, 10))
                .viewsCount(85)
                .technologies(Set.of(techs.get("Android"), techs.get("Kotlin"), techs.get("Java")))
                .build());

        createProject(Project.builder()
                .title("Gestor de Inventarios")
                .slug("gestor-de-inventarios")
                .shortDescription("Sistema web para administración de inventarios y ventas")
                .description("CRUD completo de productos, categorías y ventas con autenticación JWT, "
                        + "desplegado con Docker y base de datos PostgreSQL.")
                .type(ProjectType.WEB)
                .status(ProjectStatus.COMPLETED)
                .featured(false)
                .startDate(LocalDate.of(2026, 3, 1))
                .endDate(LocalDate.of(2026, 6, 20))
                .viewsCount(45)
                .technologies(Set.of(
                        techs.get("Spring"),
                        techs.get("Java"),
                        techs.get("PostgreSQL"),
                        techs.get("Docker")))
                .build());
    }

    private void createProject(Project project) {
        if (projectRepository.findBySlug(project.getSlug()).isPresent()) {
            return;
        }
        projectRepository.save(project);
        log.info("Seed de proyecto completado: {}", project.getSlug());
    }
}
