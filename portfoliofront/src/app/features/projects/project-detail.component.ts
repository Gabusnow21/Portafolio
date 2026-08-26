import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/portfolio.models';
import { TechBadgeComponent } from '../../shared/components/tech-badge/tech-badge.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, TechBadgeComponent],
  template: `
    <section class="section">
      <div class="container">
        @if (loading()) {
          <div class="loading">Cargando proyecto...</div>
        } @else if (project(); as p) {
          <a routerLink="/projects" class="back-link">&larr; Volver a proyectos</a>

          <article class="project-detail">
            @if (p.imageUrl) {
              <div class="project-image">
                <img [src]="p.imageUrl" [alt]="p.title">
              </div>
            }

            <div class="project-header">
              <div class="project-meta">
                <span class="type-badge" [class]="'type-' + p.type.toLowerCase()">{{ p.type }}</span>
                <span class="status-badge">{{ p.status }}</span>
                @if (p.featured) {
                  <span class="featured-badge">Destacado</span>
                }
              </div>
              <h1>{{ p.title }}</h1>
              <p class="project-short">{{ p.shortDescription }}</p>
            </div>

            <div class="project-techs">
              <h3>Tecnologías</h3>
              <div class="tech-list">
                @for (tech of p.technologies; track tech.id) {
                  <app-tech-badge [tech]="tech" />
                }
              </div>
            </div>

            <div class="project-body">
              <h3>Descripción</h3>
              <div class="description">{{ p.description }}</div>
            </div>

            <div class="project-links">
              @if (p.repoUrl) {
                <a [href]="p.repoUrl" target="_blank" rel="noopener" class="btn btn-outline">Código Fuente</a>
              }
              @if (p.demoUrl) {
                <a [href]="p.demoUrl" target="_blank" rel="noopener" class="btn btn-primary">Ver Demo</a>
              }
            </div>

            <div class="project-stats">
              <span>{{ p.viewsCount }} vistas</span>
              @if (p.startDate) {
                <span>Inicio: {{ p.startDate }}</span>
              }
              @if (p.endDate) {
                <span>Fin: {{ p.endDate }}</span>
              }
            </div>
          </article>
        } @else {
          <div class="empty">Proyecto no encontrado.</div>
          <a routerLink="/projects" class="btn btn-outline">Volver a proyectos</a>
        }
      </div>
    </section>
  `,
  styles: [`
    .back-link {
      display: inline-block;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    .back-link:hover { color: var(--accent); }
    .project-detail { max-width: 800px; }
    .project-image {
      border-radius: var(--radius-lg);
      overflow: hidden;
      margin-bottom: 1.5rem;
      background: var(--bg-tertiary);
    }
    .project-image img {
      width: 100%;
      aspect-ratio: 16/9;
      object-fit: cover;
    }
    .project-header { margin-bottom: 2rem; }
    .project-meta {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
    }
    .type-badge, .status-badge, .featured-badge {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
    }
    .type-web { background: #dbeafe; color: #1d4ed8; }
    .type-mobile { background: #d1fae5; color: #047857; }
    .status-badge { background: var(--badge-bg); color: var(--badge-text); }
    .featured-badge { background: var(--accent-light); color: var(--accent); }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .project-short {
      font-size: 1.1rem;
      color: var(--text-secondary);
    }
    .project-techs { margin-bottom: 2rem; }
    .project-techs h3 { font-size: 1rem; margin-bottom: 0.75rem; }
    .tech-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .project-body { margin-bottom: 2rem; }
    .project-body h3 { font-size: 1rem; margin-bottom: 0.75rem; }
    .description {
      color: var(--text-secondary);
      line-height: 1.7;
      white-space: pre-wrap;
    }
    .project-links {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .project-stats {
      display: flex;
      gap: 1.5rem;
      font-size: 0.85rem;
      color: var(--text-muted);
      padding-top: 1rem;
      border-top: 1px solid var(--border);
    }
    .loading, .empty {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
    }
  `]
})
export class ProjectDetailComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly route = inject(ActivatedRoute);

  project = signal<Project | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.projectService.getBySlug(slug).subscribe({
          next: (p) => {
            this.project.set(p);
            this.projectService.incrementViews(p.id).subscribe();
            this.loading.set(false);
          },
          error: () => this.loading.set(false)
        });
      } else {
        this.loading.set(false);
      }
    });
  }
}
