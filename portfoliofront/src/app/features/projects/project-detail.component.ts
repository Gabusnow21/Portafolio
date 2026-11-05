import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/portfolio.models';
import { TechBadgeComponent } from '../../shared/components/tech-badge/tech-badge.component';
import { PixelIconComponent } from '../../shared/ui/pixel-icon/pixel-icon.component';
import { RpgButtonDirective } from '../../shared/ui/rpg-button/rpg-button.directive';
import { RpgWindowComponent } from '../../shared/ui/rpg-window/rpg-window.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    RouterLink,
    TechBadgeComponent,
    PixelIconComponent,
    RpgButtonDirective,
    RpgWindowComponent
  ],
  template: `
    <section class="rpg-section quest-detail">
      <div class="container">
        @if (loading()) {
          <app-rpg-window variant="dialogue">
            <p class="rpg-blink quest-detail__state">Cargando misión...</p>
          </app-rpg-window>
        } @else if (project(); as p) {
          <a routerLink="/projects" class="quest-detail__back">
            <app-pixel-icon name="arrow-right" [size]="14" class="quest-detail__back-icon" />
            Volver al Quest Log
          </a>

          <header class="quest-detail__head">
            <div class="quest-detail__heading">
              <span class="rpg-section__eyebrow">// BRIEFING DE MISIÓN</span>
              <h1 class="quest-detail__title">{{ p.title }}</h1>
              <p class="quest-detail__lead">{{ p.shortDescription }}</p>
            </div>

            <div class="quest-detail__badges">
              <span
                class="rpg-badge"
                [class.rpg-badge--success]="p.status === 'COMPLETED'"
                [class.rpg-badge--warning]="p.status === 'IN_PROGRESS'"
                [class.rpg-badge--muted]="p.status === 'MAINTAINED'"
              >
                {{ statusLabel }}
              </span>
              <span class="rpg-badge rpg-badge--muted">{{ typeLabel }}</span>
              @if (p.featured) {
                <span class="rpg-badge rpg-badge--warning">
                  <app-pixel-icon name="star" [size]="12" />
                  Destacada
                </span>
              }
            </div>
          </header>

          <div class="quest-detail__grid">
            <div class="quest-detail__main">
              <app-rpg-window variant="panel" title="Registro visual">
                @if (p.imageUrl) {
                  <div class="quest-detail__image">
                    <img [src]="p.imageUrl" [alt]="'Imagen del proyecto ' + p.title" loading="lazy">
                  </div>
                } @else {
                  <div class="quest-detail__placeholder">
                    <app-pixel-icon name="scroll" [size]="48" />
                    <p>Sin registro visual disponible para esta misión.</p>
                  </div>
                }
              </app-rpg-window>

              <app-rpg-window variant="dialogue" title="Descripción">
                <div class="rpg-prose">
                  <p class="quest-detail__description">{{ p.description }}</p>
                </div>
              </app-rpg-window>
            </div>

            <aside class="quest-detail__side" aria-label="Información de la misión">
              <app-rpg-window variant="panel" title="Detalles">
                <dl class="quest-detail__meta">
                  <div>
                    <dt>Estado</dt>
                    <dd>{{ statusLabel }}</dd>
                  </div>
                  <div>
                    <dt>Tipo</dt>
                    <dd>{{ typeLabel }}</dd>
                  </div>
                  <div>
                    <dt>Inicio</dt>
                    <dd>{{ p.startDate || '—' }}</dd>
                  </div>
                  <div>
                    <dt>Fin</dt>
                    <dd>{{ p.endDate || 'En curso' }}</dd>
                  </div>
                  <div>
                    <dt>Visitas</dt>
                    <dd>{{ p.viewsCount }}</dd>
                  </div>
                </dl>
              </app-rpg-window>

              <app-rpg-window variant="panel" title="Recompensas">
                @if (p.technologies.length > 0) {
                  <div class="quest-detail__techs">
                    @for (tech of p.technologies; track tech.id) {
                      <app-tech-badge [tech]="tech" />
                    }
                  </div>
                } @else {
                  <p class="text-dim">Sin tecnologías registradas.</p>
                }
              </app-rpg-window>

              <app-rpg-window variant="dialogue" title="Acciones">
                <div class="quest-detail__actions">
                  @if (p.demoUrl) {
                    <a [href]="p.demoUrl" target="_blank" rel="noopener" appRpgButton variant="primary">
                      Ver demo
                      <app-pixel-icon name="external" [size]="14" />
                    </a>
                  }
                  @if (p.repoUrl) {
                    <a [href]="p.repoUrl" target="_blank" rel="noopener" appRpgButton variant="secondary">
                      Código fuente
                      <app-pixel-icon name="code" [size]="14" />
                    </a>
                  }
                  @if (!p.demoUrl && !p.repoUrl) {
                    <p class="text-dim">Sin enlaces disponibles para esta misión.</p>
                  }
                </div>
              </app-rpg-window>
            </aside>
          </div>
        } @else {
          <app-rpg-window variant="dialogue">
            <div class="quest-detail__state">
              <p>No se encontró esa misión.</p>
              <a routerLink="/projects" appRpgButton variant="secondary" size="sm">
                Volver al Quest Log
              </a>
            </div>
          </app-rpg-window>
        }
      </div>
    </section>
  `,
  styles: [`
    .quest-detail {
      padding-top: var(--space-12);
    }

    .quest-detail__back {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      margin-bottom: var(--space-5);
      color: var(--rpg-text-muted);
      font-family: var(--font-mono);
      font-size: var(--text-sm);
      text-decoration: none;
    }

    .quest-detail__back:hover {
      color: var(--rpg-gold-pale);
      text-decoration: underline;
    }

    .quest-detail__back-icon {
      transform: rotate(180deg);
    }

    .quest-detail__head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--space-4);
      margin-bottom: var(--space-6);
    }

    .quest-detail__heading {
      max-width: 70ch;
    }

    .quest-detail__title {
      color: var(--rpg-gold-pale);
      font-size: var(--text-4xl);
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    .quest-detail__lead {
      margin-top: var(--space-2);
      color: var(--rpg-text-muted);
      font-size: var(--text-lg);
    }

    .quest-detail__badges {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .quest-detail__grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
      gap: var(--space-6);
      align-items: start;
    }

    .quest-detail__main {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .quest-detail__side {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .quest-detail__image {
      overflow: hidden;
      border: 2px solid var(--rpg-gold);
      background: var(--rpg-ink);
      box-shadow: var(--shadow-hard);
    }

    .quest-detail__image img {
      width: 100%;
      aspect-ratio: 16 / 9;
      object-fit: cover;
    }

    .quest-detail__placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-3);
      min-height: 220px;
      border: 2px dashed rgba(201, 162, 39, 0.45);
      color: var(--rpg-text-dim);
      text-align: center;
    }

    .quest-detail__placeholder p {
      max-width: 40ch;
      font-size: var(--text-sm);
    }

    .quest-detail__description {
      white-space: pre-wrap;
    }

    .quest-detail__meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-3);
      margin: 0;
    }

    .quest-detail__meta dt {
      color: var(--rpg-text-dim);
      font-size: var(--text-xs);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .quest-detail__meta dd {
      margin: 0;
      color: var(--rpg-text);
      font-family: var(--font-display);
      font-size: var(--text-base);
      line-height: 1.3;
      overflow-wrap: anywhere;
    }

    .quest-detail__techs {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .quest-detail__actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .quest-detail__state {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-3);
      color: var(--rpg-text-muted);
    }

    @media (max-width: 900px) {
      .quest-detail {
        padding-top: var(--space-8);
      }

      .quest-detail__grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProjectDetailComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly route = inject(ActivatedRoute);

  project = signal<Project | null>(null);
  loading = signal(true);

  get statusLabel(): string {
    const status = this.project()?.status;
    switch (status) {
      case 'IN_PROGRESS':
        return 'En curso';
      case 'MAINTAINED':
        return 'Mantenida';
      default:
        return 'Completada';
    }
  }

  get typeLabel(): string {
    return this.project()?.type === 'MOBILE' ? 'Móvil' : 'Web';
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const slug = params['slug'];
      if (!slug) {
        this.loading.set(false);
        return;
      }

      this.loading.set(true);
      this.projectService.getBySlug(slug).subscribe({
        next: (project) => {
          this.project.set(project);
          this.projectService.incrementViews(project.id).subscribe({ error: () => undefined });
          this.loading.set(false);
        },
        error: () => {
          this.project.set(null);
          this.loading.set(false);
        }
      });
    });
  }
}
