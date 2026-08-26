import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: `
    <section class="section">
      <div class="container">
        <h1>Panel de Administración</h1>
        <p class="subtitle">Gestiona proyectos, tecnologías y mensajes.</p>
        <div class="card placeholder-card">
          <p>Panel admin se implementará en la Fase 6.</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .subtitle { color: var(--text-secondary); margin-bottom: 2rem; }
    .placeholder-card {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
    }
  `]
})
export class AdminComponent {}
