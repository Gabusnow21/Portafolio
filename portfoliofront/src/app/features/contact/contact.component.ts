import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="section">
      <div class="container">
        <div class="contact-layout">
          <div class="contact-info">
            <h1>Contacto</h1>
            <p class="subtitle">¿Tienes un proyecto en mente? Me encantaría escuchar tu idea.</p>
            <div class="info-items">
              <div class="info-item">
                <span class="info-label">Email</span>
                <span>tu@correo.com</span>
              </div>
              <div class="info-item">
                <span class="info-label">GitHub</span>
                <a href="https://github.com/Gabusnow21" target="_blank" rel="noopener">Gabusnow21</a>
              </div>
            </div>
          </div>

          <div class="card contact-form-card">
            @if (sent()) {
              <div class="success-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <h3>Mensaje enviado</h3>
                <p>Gracias por contactarme. Te responderé pronto.</p>
                <button class="btn btn-outline" (click)="resetForm()">Enviar otro</button>
              </div>
            } @else {
              <form [formGroup]="form" (ngSubmit)="onSubmit()">
                <div class="form-group">
                  <label for="name">Nombre *</label>
                  <input id="name" type="text" formControlName="name" placeholder="Tu nombre">
                  @if (form.get('name')?.touched && form.get('name')?.errors) {
                    <span class="error">Nombre requerido.</span>
                  }
                </div>

                <div class="form-group">
                  <label for="email">Email *</label>
                  <input id="email" type="email" formControlName="email" placeholder="tu@correo.com">
                  @if (form.get('email')?.touched && form.get('email')?.errors) {
                    <span class="error">Email válido requerido.</span>
                  }
                </div>

                <div class="form-group">
                  <label for="subject">Asunto *</label>
                  <input id="subject" type="text" formControlName="subject" placeholder="Asunto del mensaje">
                  @if (form.get('subject')?.touched && form.get('subject')?.errors) {
                    <span class="error">Asunto requerido.</span>
                  }
                </div>

                <div class="form-group">
                  <label for="message">Mensaje *</label>
                  <textarea id="message" formControlName="message" rows="5" placeholder="Cuéntame sobre tu proyecto..."></textarea>
                  @if (form.get('message')?.touched && form.get('message')?.errors) {
                    <span class="error">Mensaje requerido.</span>
                  }
                </div>

                @if (error()) {
                  <div class="error-banner">{{ error() }}</div>
                }

                <button type="submit" class="btn btn-primary btn-block" [disabled]="form.invalid || submitting()">
                  @if (submitting()) {
                    Enviando...
                  } @else {
                    Enviar Mensaje
                  }
                </button>
              </form>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-layout {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 3rem;
      align-items: start;
    }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .subtitle {
      color: var(--text-secondary);
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    .info-items { display: flex; flex-direction: column; gap: 1rem; }
    .info-item { display: flex; flex-direction: column; gap: 0.2rem; }
    .info-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      font-weight: 600;
    }
    .contact-form-card { padding: 2rem; }
    .form-group {
      margin-bottom: 1.25rem;
    }
    .form-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      margin-bottom: 0.35rem;
      color: var(--text-secondary);
    }
    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.6rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: 0.9rem;
      font-family: inherit;
      transition: border-color 0.2s;
    }
    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--accent);
    }
    .error {
      font-size: 0.75rem;
      color: #dc3545;
      margin-top: 0.25rem;
      display: block;
    }
    .error-banner {
      background: #fef2f2;
      color: #dc3545;
      padding: 0.75rem;
      border-radius: var(--radius);
      font-size: 0.85rem;
      margin-bottom: 1rem;
    }
    [data-theme='dark'] .error-banner {
      background: #3b1111;
    }
    .btn-block {
      width: 100%;
    }
    .success-message {
      text-align: center;
      padding: 2rem 0;
    }
    .success-message svg {
      color: #22c55e;
      margin-bottom: 1rem;
    }
    .success-message h3 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }
    .success-message p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }
    @media (max-width: 768px) {
      .contact-layout {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }
  `]
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required]
  });

  submitting = signal(false);
  sent = signal(false);
  error = signal('');

  onSubmit(): void {
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.error.set('');

    this.contactService.send(this.form.value).subscribe({
      next: () => {
        this.sent.set(true);
        this.submitting.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.detail || 'Error al enviar el mensaje. Intenta de nuevo.');
        this.submitting.set(false);
      }
    });
  }

  resetForm(): void {
    this.form.reset();
    this.sent.set(false);
    this.error.set('');
  }
}
