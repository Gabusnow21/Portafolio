import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { TechnologyService } from '../../core/services/technology.service';
import { Project, Technology } from '../../core/models/portfolio.models';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';
import { TechBadgeComponent } from '../../shared/components/tech-badge/tech-badge.component';
import { PixelIconComponent } from '../../shared/ui/pixel-icon/pixel-icon.component';
import { RpgButtonDirective } from '../../shared/ui/rpg-button/rpg-button.directive';
import { RpgWindowComponent } from '../../shared/ui/rpg-window/rpg-window.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    ProjectCardComponent,
    TechBadgeComponent,
    PixelIconComponent,
    RpgButtonDirective,
    RpgWindowComponent
  ],
  template: `
    <section class="home-hero">
      <div class="container home-hero__grid">
        <app-rpg-window variant="panel">
          <div class="home-hero__content">
            <p class="home-hero__eyebrow">// NUEVA PARTIDA</p>
            <h1 class="home-hero__title">
              GABUS<span class="home-hero__title-dot">.</span>DEV
            </h1>
            <p class="home-hero__role">Front-end Developer · UX/UI Designer</p>
            <p class="home-hero__description">
              Construyo interfaces web y aplicaciones móviles con Angular, Spring Boot y
              Android. Me obsesiona el detalle visual, la accesibilidad y la experiencia
              de quien usa lo que construyo.
            </p>

            <div class="home-hero__actions">
              <a routerLink="/projects" appRpgButton variant="primary" size="lg">
                <app-pixel-icon name="scroll" [size]="18" />
                Abrir Quest Log
              </a>
              <a routerLink="/contact" appRpgButton variant="secondary" size="lg">
                <app-pixel-icon name="mail" [size]="18" />
                Enviar mensaje
              </a>
            </div>
          </div>
        </app-rpg-window>

        <aside class="home-hero__side" aria-label="Accesos rápidos">
          <app-rpg-window variant="dialogue" title="Menú rápido">
            <nav class="rpg-menu" aria-label="Accesos rápidos">
              <a routerLink="/about" appRpgButton variant="menu">
                <app-pixel-icon name="user" [size]="14" />
                Ficha de personaje
              </a>
              <a routerLink="/projects" appRpgButton variant="menu">
                <app-pixel-icon name="scroll" [size]="14" />
                Quest Log
              </a>
              <a routerLink="/contact" appRpgButton variant="menu">
                <app-pixel-icon name="mail" [size]="14" />
                Contacto
              </a>
              <a
                href="https://github.com/Gabusnow21"
                target="_blank"
                rel="noopener"
                appRpgButton
                variant="menu"
              >
                <app-pixel-icon name="code" [size]="14" />
                GitHub
              </a>
            </nav>

            <hr class="rpg-divider rpg-divider--dotted home-hero__divider" />

            <div class="home-hero__status">
              <span class="rpg-badge rpg-badge--success">
                <app-pixel-icon name="check" [size]="12" />
                Disponible para proyectos
              </span>
              <p class="home-hero__status-note">Angular · Spring Boot · Android</p>
            </div>
          </app-rpg-window>

          <app-rpg-window variant="parchment">
            <p class="home-hero__note">
              <strong>Consejo del gremio:</strong> abre el Quest Log para ver los proyectos
              en detalle, o envía un mensaje si quieres que trabajemos juntos.
            </p>
          </app-rpg-window>
        </aside>
      </div>
    </section>

    @if (technologies().length > 0) {
      <section class="rpg-section home-tech">
        <div class="container">
          <app-rpg-window variant="panel" title="Equipamiento">
            <p class="rpg-section__lead home-tech__lead">
              Tecnologías y herramientas que llevo en la mochila.
            </p>
            <div class="home-tech__grid">
              @for (tech of technologies(); track tech.id) {
                <app-tech-badge [tech]="tech" />
              }
            </div>
          </app-rpg-window>
        </div>
      </section>
    }

    <section class="rpg-section home-quests" aria-labelledby="featured-quests-title">
      <div class="container">
        <div class="rpg-section__head">
          <div>
            <span class="rpg-section__eyebrow">// TABLÓN DE MISIONES</span>
            <h2 id="featured-quests-title" class="rpg-section__title">Misiones destacadas</h2>
            <p class="rpg-section__lead">
              Una selección de proyectos donde el código y el diseño se encuentran.
            </p>
          </div>
          <a routerLink="/projects" appRpgButton variant="secondary">
            Ver todas
            <app-pixel-icon name="arrow-right" [size]="16" />
          </a>
        </div>

        @if (projectsLoading()) {
          <app-rpg-window variant="dialogue">
            <p class="rpg-blink home-quests__loading">Cargando misiones...</p>
          </app-rpg-window>
        } @else if (featuredProjects().length > 0) {
          <div class="projects-grid">
            @for (project of featuredProjects(); track project.id) {
              <app-project-card [project]="project" />
            }
          </div>
        } @else {
          <app-rpg-window variant="dialogue">
            <p class="home-quests__empty">
              No hay misiones destacadas por ahora. Explora el Quest Log completo.
            </p>
          </app-rpg-window>
        }
      </div>
    </section>
  `,
  styles: [`
    .home-hero {
      padding: var(--space-16) 0 var(--space-12);
    }

    .home-hero__grid {
      display: grid;
      grid-template-columns: minmax(0, 1.55fr) minmax(280px, 0.9fr);
      gap: var(--space-6);
      align-items: start;
    }

    .home-hero__content {
      padding: var(--space-2);
    }

    .home-hero__eyebrow {
      margin-bottom: var(--space-3);
      color: var(--rpg-gold-bright);
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }

    .home-hero__title {
      color: var(--rpg-gold-pale);
      font-size: var(--text-4xl);
      letter-spacing: 0.04em;
      text-shadow:
        3px 3px 0 var(--rpg-shadow),
        6px 6px 0 rgba(201, 162, 39, 0.16);
    }

    .home-hero__title-dot {
      color: var(--rpg-text);
    }

    .home-hero__role {
      margin-top: var(--space-2);
      color: var(--rpg-text);
      font-family: var(--font-display);
      font-size: var(--text-xl);
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .home-hero__description {
      max-width: 58ch;
      margin-top: var(--space-4);
      color: var(--rpg-text-muted);
    }

    .home-hero__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
      margin-top: var(--space-6);
    }

    .home-hero__side {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .home-hero__divider {
      margin: var(--space-4) 0;
    }

    .home-hero__status {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-2);
    }

    .home-hero__status-note {
      color: var(--rpg-text-dim);
      font-size: var(--text-xs);
    }

    .home-hero__note {
      color: #3a2a12;
      font-size: var(--text-sm);
      line-height: 1.55;
    }

    .home-tech {
      padding-top: 0;
    }

    .home-tech__lead {
      margin-top: 0;
      margin-bottom: var(--space-4);
    }

    .home-tech__grid {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .home-quests {
      padding-top: var(--space-10);
    }

    .home-quests__loading,
    .home-quests__empty {
      color: var(--rpg-text-muted);
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-6);
    }

    @media (max-width: 900px) {
      .home-hero__grid {
        grid-template-columns: 1fr;
      }

      .home-hero {
        padding-top: var(--space-10);
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly technologyService = inject(TechnologyService);

  featuredProjects = signal<Project[]>([]);
  technologies = signal<Technology[]>([]);
  projectsLoading = signal(true);

  ngOnInit(): void {
    this.projectService.listFeatured(0, 6).subscribe({
      next: (res) => {
        this.featuredProjects.set(res.content);
        this.projectsLoading.set(false);
      },
      error: () => this.projectsLoading.set(false)
    });

    this.technologyService.listAll().subscribe({
      next: (techs) => this.technologies.set(techs),
      error: () => this.technologies.set([])
    });
  }
}
