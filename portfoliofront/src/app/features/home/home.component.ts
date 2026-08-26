import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { TechnologyService } from '../../core/services/technology.service';
import { Project, Technology } from '../../core/models/portfolio.models';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';
import { TechBadgeComponent } from '../../shared/components/tech-badge/tech-badge.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProjectCardComponent, TechBadgeComponent],
  template: `
    <section class="hero section">
      <div class="container">
        <div class="hero-content">
          <p class="hero-greeting">Hola, soy</p>
          <h1 class="hero-title">Desarrollador Full-Stack</h1>
          <p class="hero-subtitle">Angular · Spring Boot · Android</p>
          <p class="hero-description">
            Creo aplicaciones web modernas y aplicaciones móviles. Apasionado por el código limpio, la experiencia de usuario y las buenas prácticas.
          </p>
          <div class="hero-actions">
            <a routerLink="/projects" class="btn btn-primary">Ver Proyectos</a>
            <a routerLink="/contact" class="btn btn-outline">Contactar</a>
          </div>
        </div>
      </div>
    </section>

    @if (technologies().length > 0) {
      <section class="section tech-section">
        <div class="container">
          <h2 class="section-title">Stack Tecnológico</h2>
          <div class="tech-grid">
            @for (tech of technologies(); track tech.id) {
              <div class="tech-item">
                <app-tech-badge [tech]="tech" />
                <span class="tech-name">{{ tech.name }}</span>
              </div>
            }
          </div>
        </div>
      </section>
    }

    @if (featuredProjects().length > 0) {
      <section class="section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Proyectos Destacados</h2>
            <a routerLink="/projects" class="btn btn-outline">Ver todos</a>
          </div>
          <div class="projects-grid">
            @for (project of featuredProjects(); track project.id) {
              <app-project-card [project]="project" />
            }
          </div>
        </div>
      </section>
    }
  `,
  styles: [`
    .hero {
      min-height: 70vh;
      display: flex;
      align-items: center;
    }
    .hero-content { max-width: 600px; }
    .hero-greeting {
      font-size: 1rem;
      color: var(--accent);
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    .hero-title {
      font-size: 2.5rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 0.5rem;
    }
    .hero-subtitle {
      font-size: 1.2rem;
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }
    .hero-description {
      font-size: 1rem;
      color: var(--text-secondary);
      line-height: 1.7;
      margin-bottom: 2rem;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .tech-section {
      background: var(--bg-secondary);
    }
    .tech-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .tech-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .tech-name {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    @media (max-width: 768px) {
      .hero-title { font-size: 1.8rem; }
    }
  `]
})
export class HomeComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly technologyService = inject(TechnologyService);

  featuredProjects = signal<Project[]>([]);
  technologies = signal<Technology[]>([]);

  ngOnInit(): void {
    this.projectService.listFeatured(0, 6).subscribe({
      next: (res) => this.featuredProjects.set(res.content)
    });

    this.technologyService.listAll().subscribe({
      next: (techs) => this.technologies.set(techs)
    });
  }
}
