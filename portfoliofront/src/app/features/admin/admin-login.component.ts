import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="login-section">
      <div class="card login-card">
        <h1>Admin Login</h1>
        <p class="subtitle">Panel de administración del portafolio.</p>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Usuario</label>
            <input id="username" type="text" [(ngModel)]="username" name="username" placeholder="admin" required>
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input id="password" type="password" [(ngModel)]="password" name="password" placeholder="••••••" required>
          </div>
          @if (error()) {
            <div class="error-banner">{{ error() }}</div>
          }
          <button type="submit" class="btn btn-primary btn-block" [disabled]="submitting()">
            @if (submitting()) { Ingresando... } @else { Iniciar Sesión }
          </button>
        </form>
      </div>
    </section>
  `,
  styles: [`
    .login-section {
      min-height: 70vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .login-card {
      width: 100%;
      max-width: 380px;
      padding: 2rem;
    }
    h1 { font-size: 1.5rem; text-align: center; margin-bottom: 0.25rem; }
    .subtitle { text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label {
      display: block; font-size: 0.85rem; font-weight: 500;
      margin-bottom: 0.3rem; color: var(--text-secondary);
    }
    .form-group input {
      width: 100%; padding: 0.6rem 0.75rem; border: 1px solid var(--border);
      border-radius: var(--radius); background: var(--bg-primary); color: var(--text-primary);
      font-size: 0.9rem;
    }
    .form-group input:focus { outline: none; border-color: var(--accent); }
    .error-banner {
      background: #fef2f2; color: #dc3545; padding: 0.75rem;
      border-radius: var(--radius); font-size: 0.85rem; margin-bottom: 1rem;
    }
    [data-theme='dark'] .error-banner { background: #3b1111; }
    .btn-block { width: 100%; }
  `]
})
export class AdminLoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  submitting = signal(false);
  error = signal('');

  onSubmit(): void {
    this.submitting.set(true);
    this.error.set('');

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.error.set(err.error?.detail || 'Credenciales incorrectas.');
        this.submitting.set(false);
      }
    });
  }
}
