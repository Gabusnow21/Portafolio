import { Component } from '@angular/core';

@Component({
  selector: 'app-projects',
  standalone: true,
  template: `
    <section class="section">
      <div class="container">
        <h1>Proyectos</h1>
        <p class="subtitle">Explora mis proyectos web y móviles.</p>
        <div class="projects-grid">
          <!-- Proyectos se cargarán desde la API en Fase 4/5 -->
          <div class="card placeholder-card">
            <p>Próximamente se cargarán los proyectos desde la API.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .subtitle { color: var(--text-secondary); margin-bottom: 2rem; }
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .placeholder-card {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
    }
  `]
})
export class ProjectsComponent {}
