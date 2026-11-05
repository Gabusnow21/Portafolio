import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { PixelIconComponent, PixelIconName } from '../../shared/ui/pixel-icon/pixel-icon.component';
import { RpgButtonDirective } from '../../shared/ui/rpg-button/rpg-button.directive';
import { RpgWindowComponent } from '../../shared/ui/rpg-window/rpg-window.component';

interface Metrics {
  totalProjects: number;
  webProjects: number;
  mobileProjects: number;
  totalTechnologies: number;
  unreadMessages: number;
  projectsByStatus: Record<string, number>;
}

interface AdminLink {
  title: string;
  description: string;
  icon: PixelIconName;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, PixelIconComponent, RpgButtonDirective, RpgWindowComponent],
  template: `
    <section class="rpg-section dashboard">
      <div class="container">
        <header class="dashboard__head">
          <div>
            <span class="rpg-section__eyebrow">// SALA DE MANDO</span>
            <h1 class="rpg-section__title">Panel del gremio</h1>
            <p class="rpg-section__lead">
              Resumen del contenido publicado y de los mensajes recibidos.
            </p>
          </div>

          <button type="button" appRpgButton variant="secondary" (click)="authService.logout()">
            <app-pixel-icon name="close" [size]="14" />
            Cerrar sesión
          </button>
        </header>

        @if (loading()) {
          <app-rpg-window variant="dialogue">
            <p class="rpg-blink dashboard__state">Cargando métricas...</p>
          </app-rpg-window>
        } @else if (error()) {
          <app-rpg-window variant="dialogue">
            <div class="dashboard__state">
              <p>No se pudieron cargar las métricas del panel.</p>
              <button type="button" appRpgButton variant="secondary" size="sm" (click)="loadMetrics()">
                Reintentar
              </button>
            </div>
          </app-rpg-window>
        } @else if (metrics(); as m) {
          <div class="metrics">
            <article class="metric">
              <span class="metric__icon" aria-hidden="true">
                <app-pixel-icon name="scroll" [size]="22" />
              </span>
              <span class="metric__value">{{ m.totalProjects }}</span>
              <span class="metric__label">Proyectos totales</span>
            </article>

            <article class="metric">
              <span class="metric__icon" aria-hidden="true">
                <app-pixel-icon name="code" [size]="22" />
              </span>
              <span class="metric__value">{{ m.webProjects }}</span>
              <span class="metric__label">Proyectos web</span>
            </article>

            <article class="metric">
              <span class="metric__icon" aria-hidden="true">
                <app-pixel-icon name="map" [size]="22" />
              </span>
              <span class="metric__value">{{ m.mobileProjects }}</span>
              <span class="metric__label">Proyectos móvil</span>
            </article>

            <article class="metric">
              <span class="metric__icon" aria-hidden="true">
                <app-pixel-icon name="spark" [size]="22" />
              </span>
              <span class="metric__value">{{ m.totalTechnologies }}</span>
              <span class="metric__label">Tecnologías</span>
            </article>

            <article class="metric metric--accent">
              <span class="metric__icon" aria-hidden="true">
                <app-pixel-icon name="mail" [size]="22" />
              </span>
              <span class="metric__value">{{ m.unreadMessages }}</span>
              <span class="metric__label">Mensajes sin leer</span>
            </article>
          </div>

          <app-rpg-window variant="panel" title="Acciones del gremio">
            <div class="admin-links">
              @for (link of adminLinks; track link.title) {
                <a routerLink="/admin/dashboard" class="admin-link">
                  <span class="admin-link__icon" aria-hidden="true">
                    <app-pixel-icon [name]="link.icon" [size]="20" />
                  </span>
                  <span class="admin-link__body">
                    <strong>{{ link.title }}</strong>
                    <small>{{ link.description }}</small>
                  </span>
                  <app-pixel-icon name="arrow-right" [size]="14" class="admin-link__arrow" />
                </a>
              }
            </div>
          </app-rpg-window>
        }
      </div>
    </section>
  `,
  styles: [`
    .dashboard {
      padding-top: var(--space-12);
    }

    .dashboard__head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--space-4);
      margin-bottom: var(--space-6);
    }

    .dashboard__state {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-3);
      color: var(--rpg-text-muted);
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: var(--space-4);
      margin-bottom: var(--space-6);
    }

    .metric {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.2rem;
      padding: var(--space-5);
      background:
        linear-gradient(
          180deg,
          var(--rpg-window-light) 0%,
          var(--rpg-window) 18%,
          var(--rpg-window-deep) 100%
        );
      border: var(--border-w) solid var(--rpg-gold);
      box-shadow:
        inset 2px 2px 0 var(--rpg-bevel-light),
        inset -2px -2px 0 var(--rpg-bevel-dark),
        0 0 0 2px var(--rpg-ink),
        var(--shadow-hard);
    }

    .metric--accent {
      border-color: var(--rpg-gold-bright);
      box-shadow:
        inset 2px 2px 0 var(--rpg-bevel-light),
        inset -2px -2px 0 var(--rpg-bevel-dark),
        0 0 0 2px var(--rpg-gold-bright),
        var(--shadow-hard);
    }

    .metric__icon {
      display: inline-flex;
      margin-bottom: var(--space-2);
      color: var(--rpg-gold-bright);
    }

    .metric__value {
      color: var(--rpg-gold-pale);
      font-family: var(--font-display);
      font-size: var(--text-3xl);
      font-variant-numeric: tabular-nums;
      line-height: 1;
    }

    .metric__label {
      color: var(--rpg-text-muted);
      font-size: var(--text-xs);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .admin-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-4);
    }

    .admin-link {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      padding: var(--space-4);
      border: 2px solid var(--rpg-text-dim);
      background: rgba(10, 20, 56, 0.6);
      color: var(--rpg-text);
      text-decoration: none;
      transition:
        transform var(--dur-fast) var(--ease-step),
        border-color var(--dur-fast) var(--ease-step),
        background-color var(--dur-fast) var(--ease-step);
    }

    .admin-link:hover {
      border-color: var(--rpg-gold-bright);
      background: var(--rpg-window);
      transform: translate(-2px, -2px);
      box-shadow: var(--shadow-hard);
    }

    .admin-link__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      flex: 0 0 auto;
      border: 1px solid var(--rpg-gold);
      background: rgba(201, 162, 39, 0.1);
      color: var(--rpg-gold-pale);
    }

    .admin-link__body {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 0.2rem;
    }

    .admin-link__body strong {
      color: var(--rpg-text);
      font-family: var(--font-display);
      font-size: var(--text-base);
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .admin-link__body small {
      color: var(--rpg-text-dim);
      font-size: var(--text-xs);
      line-height: 1.45;
    }

    .admin-link__arrow {
      margin-top: 0.7rem;
      color: var(--rpg-gold-bright);
    }

    @media (max-width: 720px) {
      .dashboard {
        padding-top: var(--space-8);
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);

  metrics = signal<Metrics | null>(null);
  loading = signal(true);
  error = signal(false);

  readonly adminLinks: AdminLink[] = [
    {
      title: 'Gestionar proyectos',
      description: 'Crear, editar y eliminar proyectos del portafolio.',
      icon: 'scroll'
    },
    {
      title: 'Gestionar tecnologías',
      description: 'Administrar las tecnologías del stack.',
      icon: 'spark'
    },
    {
      title: 'Bandeja de mensajes',
      description: 'Ver y gestionar los mensajes de contacto.',
      icon: 'mail'
    }
  ];

  ngOnInit(): void {
    this.loadMetrics();
  }

  loadMetrics(): void {
    this.loading.set(true);
    this.error.set(false);

    this.http.get<Metrics>('/metrics').subscribe({
      next: (m) => {
        this.metrics.set(m);
        this.loading.set(false);
      },
      error: () => {
        this.metrics.set(null);
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }
}
