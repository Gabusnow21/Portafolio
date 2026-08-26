import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <section class="hero section">
      <div class="container">
        <h1>Portafolio</h1>
        <p class="subtitle">Desarrollador Full-Stack · Angular · Spring Boot · Android</p>
        <div class="actions">
          <a routerLink="/projects" class="btn btn-primary">Ver Proyectos</a>
          <a routerLink="/contact" class="btn btn-outline">Contactar</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      min-height: 70vh;
      display: flex;
      align-items: center;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }
    .subtitle {
      font-size: 1.1rem;
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }
    .actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
  `]
})
export class HomeComponent {}
