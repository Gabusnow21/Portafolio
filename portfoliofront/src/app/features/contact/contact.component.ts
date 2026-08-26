import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  template: `
    <section class="section">
      <div class="container">
        <h1>Contacto</h1>
        <p class="subtitle">¿Tienes un proyecto en mente? Escríbeme.</p>
        <div class="card placeholder-card">
          <p>Formulario de contacto se implementará en la Fase 4.</p>
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
export class ContactComponent {}
