package com.dev.gabus.portafolioback.repository;

import com.dev.gabus.portafolioback.model.entity.Project;
import com.dev.gabus.portafolioback.model.enums.ProjectType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    Optional<Project> findBySlug(String slug);

    Page<Project> findByType(ProjectType type, Pageable pageable);

    Page<Project> findByFeaturedTrue(Pageable pageable);

    @Query("SELECT p FROM Project p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) "
         + "OR LOWER(p.shortDescription) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Project> searchByQuery(@Param("query") String query, Pageable pageable);

    @Query("SELECT p FROM Project p JOIN p.technologies t WHERE t.id = :technologyId")
    Page<Project> findByTechnologyId(@Param("technologyId") Long technologyId, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.type = :type")
    long countByType(@Param("type") ProjectType type);
}
