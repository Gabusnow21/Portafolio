import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../../core/models/portfolio.models';
import { TechBadgeComponent } from '../tech-badge/tech-badge.component';
import { PixelIconComponent } from '../../ui/pixel-icon/pixel-icon.component';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink, TechBadgeComponent, PixelIconComponent],
  template: `
    <article class="quest-card rpg-window rpg-window--panel">
      @if (project.imageUrl) {
        <div class="quest-card__media">
          <img
            [src]="project.imageUrl"
            [alt]="'Imagen del proyecto ' + project.title"
            loading="lazy"
            decoding="async"
          >
        </div>
      }

      <div class="quest-card__body">
        <div class="quest-card__meta">
          <span
            class="rpg-badge"
            [class.rpg-badge--success]="project.status === 'COMPLETED'"
            [class.rpg-badge--warning]="project.status === 'IN_PROGRESS'"
            [class.rpg-badge--muted]="project.status === 'MAINTAINED'"
          >
            {{ statusLabel }}
          </span>

          <span class="rpg-badge rpg-badge--muted">{{ typeLabel }}</span>

          @if (project.featured) {
            <span class="rpg-badge rpg-badge--warning">
              <app-pixel-icon name="star" [size]="12" />
              Destacada
            </span>
          }
        </div>

        <h3 class="quest-card__title">
          <a [routerLink]="['/projects', project.slug]">{{ project.title }}</a>
        </h3>

        <p class="quest-card__description">{{ project.shortDescription }}</p>

        @if (project.technologies.length > 0) {
          <div class="quest-card__techs">
            @for (tech of project.technologies; track tech.id) {
              <app-tech-badge [tech]="tech" />
            }
          </div>
        }

        <div class="quest-card__footer">
          <span class="quest-card__views">{{ project.viewsCount }} visitas</span>
          <a [routerLink]="['/projects', project.slug]" class="quest-card__link">
            Abrir misión
            <app-pixel-icon name="arrow-right" [size]="14" />
          </a>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .quest-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 0;
      transition:
        transform var(--dur-fast) var(--ease-step),
        box-shadow var(--dur-fast) var(--ease-step);
    }

    .quest-card:hover,
    .quest-card:focus-within {
      transform: translate(-2px, -2px);
      box-shadow:
        inset 2px 2px 0 var(--rpg-bevel-light),
        inset -2px -2px 0 var(--rpg-bevel-dark),
        0 0 0 2px var(--rpg-ink),
        var(--shadow-hard-lg);
    }

    .quest-card__media {
      aspect-ratio: 16 / 9;
      overflow: hidden;
      background: var(--rpg-ink);
      border-bottom: 2px solid var(--rpg-gold);
    }

    .quest-card__media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--dur-slow) var(--ease-step);
    }

    .quest-card:hover .quest-card__media img {
      transform: scale(1.03);
    }

    .quest-card__body {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: var(--space-3);
      padding: var(--space-5);
    }

    .quest-card__meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .quest-card__title {
      font-size: var(--text-lg);
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    .quest-card__title a {
      color: var(--rpg-text);
      text-decoration: none;
    }

    .quest-card__title a:hover {
      color: var(--rpg-gold-pale);
      text-decoration: underline;
    }

    .quest-card__description {
      flex: 1;
      color: var(--rpg-text-muted);
      font-size: var(--text-sm);
      line-height: 1.55;
    }

    .quest-card__techs {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .quest-card__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
      margin-top: var(--space-1);
      padding-top: var(--space-3);
      border-top: 1px dashed rgba(201, 162, 39, 0.35);
    }

    .quest-card__views {
      color: var(--rpg-text-dim);
      font-size: var(--text-xs);
    }

    .quest-card__link {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      color: var(--rpg-gold-bright);
      font-family: var(--font-display);
      font-size: var(--text-sm);
      font-weight: 600;
      letter-spacing: 0.05em;
      text-decoration: none;
      text-transform: uppercase;
    }

    .quest-card__link:hover {
      color: var(--rpg-gold-pale);
      text-decoration: underline;
    }
  `]
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;

  get statusLabel(): string {
    switch (this.project.status) {
      case 'IN_PROGRESS':
        return 'En curso';
      case 'MAINTAINED':
        return 'Mantenida';
      default:
        return 'Completada';
    }
  }

  get typeLabel(): string {
    return this.project.type === 'MOBILE' ? 'Móvil' : 'Web';
  }
}
