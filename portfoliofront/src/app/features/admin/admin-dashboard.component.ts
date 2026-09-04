import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

interface Metrics {
  totalProjects: number;
  webProjects: number;
  mobileProjects: number;
  totalTechnologies: number;
  unreadMessages: number;
  projectsByStatus: Record<string, number>;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="section">
      <div class="container">
        <div class="dashboard-header">
          <h1>Dashboard</h1>
          <button class="btn btn-outline" (click)="authService.logout()">Cerrar Sesión</button>
        </div>

        @if (metrics(); as m) {
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-value">{{ m.totalProjects }}</span>
              <span class="stat-label">Proyectos Totales</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ m.webProjects }}</span>
              <span class="stat-label">Proyectos Web</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ m.mobileProjects }}</span>
              <span class="stat-label">Proyectos Móvil</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ m.totalTechnologies }}</span>
              <span class="stat-label">Tecnologías</span>
            </div>
            <div class="stat-card accent">
              <span class="stat-value">{{ m.unreadMessages }}</span>
              <span class="stat-label">Mensajes Sin Leer</span>
            </div>
          </div>

          <div class="admin-links">
            <a routerLink="/admin/projects" class="card admin-link-card">
              <h3>Gestionar Proyectos</h3>
              <p>Crear, editar y eliminar proyectos del portafolio.</p>
            </a>
            <a routerLink="/admin/technologies" class="card admin-link-card">
              <h3>Gestionar Tecnologías</h3>
              <p>Administrar las tecnologías del stack.</p>
            </a>
            <a routerLink="/admin/messages" class="card admin-link-card">
              <h3>Bandeja de Mensajes</h3>
              <p>Ver y gestionar mensajes de contacto.</p>
            </a>
          </div>
        } @else {
          <div class="loading">Cargando métricas...</div>
        }
      </div>
    </section>
  `,
  styles: [`
    .dashboard-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;
    }
    h1 { font-size: 1.8rem; }
    .stats-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1rem; margin-bottom: 2rem;
    }
    .stat-card {
      background: var(--card-bg); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 1.25rem; text-align: center;
    }
    .stat-card.accent { border-color: var(--accent); }
    .stat-value {
      display: block; font-size: 2rem; font-weight: 700; color: var(--accent);
    }
    .stat-label {
      font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .admin-links {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }
    .admin-link-card {
      display: block; cursor: pointer; transition: transform 0.2s;
    }
    .admin-link-card:hover { transform: translateY(-2px); }
    .admin-link-card h3 { font-size: 1rem; margin-bottom: 0.3rem; color: var(--text-primary); }
    .admin-link-card p { font-size: 0.85rem; color: var(--text-secondary); }
    .loading { text-align: center; padding: 3rem; color: var(--text-muted); }
  `]
})
export class AdminDashboardComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);

  metrics = signal<Metrics | null>(null);

  ngOnInit(): void {
    this.http.get<Metrics>('/metrics').subscribe({
      next: (m) => this.metrics.set(m)
    });
  }
}
