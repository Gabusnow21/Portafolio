import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../../core/models/portfolio.models';
import { TechBadgeComponent } from '../tech-badge/tech-badge.component';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink, TechBadgeComponent],
  template: `
    <article class="card project-card">
      @if (project.imageUrl) {
        <div class="card-image">
          <img [src]="project.imageUrl" [alt]="project.title" loading="lazy">
        </div>
      }
      <div class="card-body">
        <div class="card-meta">
          <span class="type-badge" [class]="'type-' + project.type.toLowerCase()">{{ project.type }}</span>
          @if (project.featured) {
            <span class="featured-badge">Destacado</span>
          }
        </div>
        <h3 class="card-title">
          <a [routerLink]="['/projects', project.slug]">{{ project.title }}</a>
        </h3>
        <p class="card-description">{{ project.shortDescription }}</p>
        <div class="card-techs">
          @for (tech of project.technologies; track tech.id) {
            <app-tech-badge [tech]="tech" />
          }
        </div>
      </div>
    </article>
  `,
  styles: [`
    .project-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .project-card:hover {
      transform: translateY(-2px);
    }
    .card-image {
      aspect-ratio: 16/9;
      overflow: hidden;
      background: var(--bg-tertiary);
    }
    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .card-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }
    .card-meta {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .type-badge {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      letter-spacing: 0.03em;
    }
    .type-web { background: #dbeafe; color: #1d4ed8; }
    .type-mobile { background: #d1fae5; color: #047857; }
    [data-theme='dark'] .type-web { background: #1e3a5f; color: #60a5fa; }
    [data-theme='dark'] .type-mobile { background: #064e3b; color: #34d399; }
    .featured-badge {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      background: var(--accent-light);
      color: var(--accent);
    }
    .card-title {
      font-size: 1.1rem;
      font-weight: 600;
    }
    .card-title a {
      color: var(--text-primary);
    }
    .card-title a:hover {
      color: var(--accent);
    }
    .card-description {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.5;
      flex: 1;
    }
    .card-techs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-top: 0.5rem;
    }
  `]
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;
}
