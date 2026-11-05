import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { PixelIconComponent } from '../../shared/ui/pixel-icon/pixel-icon.component';
import { RpgButtonDirective } from '../../shared/ui/rpg-button/rpg-button.directive';
import { RpgWindowComponent } from '../../shared/ui/rpg-window/rpg-window.component';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, RouterLink, PixelIconComponent, RpgButtonDirective, RpgWindowComponent],
  template: `
    <section class="rpg-section login">
      <div class="container login__wrap">
        <app-rpg-window variant="panel" title="Sala de mando">
          <div class="login__head">
            <span class="login__icon" aria-hidden="true">
              <app-pixel-icon name="lock" [size]="28" />
            </span>
            <h1 class="login__title">Acceso restringido</h1>
            <p class="login__subtitle">
              Identifícate para administrar el contenido del portafolio.
            </p>
          </div>

          <form class="login__form" (ngSubmit)="onSubmit()" novalidate>
            <div class="login__field">
              <label for="username">Usuario</label>
              <input
                id="username"
                type="text"
                name="username"
                [(ngModel)]="username"
                autocomplete="username"
                placeholder="admin"
                required
              >
            </div>

            <div class="login__field">
              <label for="password">Contraseña</label>
              <input
                id="password"
                type="password"
                name="password"
                [(ngModel)]="password"
                autocomplete="current-password"
                placeholder="••••••••"
                required
              >
            </div>

            @if (error()) {
              <div class="login__error" role="alert">
                <app-pixel-icon name="warning" [size]="16" />
                <span>{{ error() }}</span>
              </div>
            }

            <button
              type="submit"
              appRpgButton
              variant="primary"
              size="lg"
              class="login__submit"
              [disabled]="submitting()"
            >
              @if (submitting()) {
                Verificando...
              } @else {
                <app-pixel-icon name="lock" [size]="16" />
                Iniciar sesión
              }
            </button>
          </form>
        </app-rpg-window>

        <p class="login__back">
          <a routerLink="/">
            <app-pixel-icon name="arrow-right" [size]="12" class="login__back-icon" />
            Volver al inicio
          </a>
        </p>
      </div>
    </section>
  `,
  styles: [`
    .login {
      padding-top: var(--space-16);
    }

    .login__wrap {
      max-width: 440px;
    }

    .login__head {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-6);
      text-align: center;
    }

    .login__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      margin-bottom: var(--space-2);
      border: 2px solid var(--rpg-gold);
      background: rgba(201, 162, 39, 0.1);
      color: var(--rpg-gold-pale);
      box-shadow: var(--shadow-hard);
    }

    .login__title {
      color: var(--rpg-gold-pale);
      font-size: var(--text-2xl);
      text-transform: uppercase;
    }

    .login__subtitle {
      max-width: 34ch;
      color: var(--rpg-text-muted);
      font-size: var(--text-sm);
      line-height: 1.5;
    }

    .login__form {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .login__field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .login__field label {
      color: var(--rpg-gold-pale);
      font-family: var(--font-display);
      font-size: var(--text-base);
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .login__field input {
      background: var(--rpg-window-deep);
    }

    .login__error {
      display: flex;
      align-items: flex-start;
      gap: var(--space-2);
      padding: var(--space-3);
      border: 2px solid var(--rpg-danger);
      background: rgba(255, 123, 123, 0.12);
      color: #ffd0d0;
      font-size: var(--text-sm);
      line-height: 1.5;
    }

    .login__submit {
      width: 100%;
      margin-top: var(--space-2);
    }

    .login__back {
      margin-top: var(--space-4);
      text-align: center;
    }

    .login__back a {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      color: var(--rpg-text-muted);
      font-size: var(--text-xs);
      text-decoration: none;
    }

    .login__back a:hover {
      color: var(--rpg-gold-pale);
      text-decoration: underline;
    }

    .login__back-icon {
      transform: rotate(180deg);
    }
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
    if (!this.username.trim() || !this.password) {
      this.error.set('Introduce usuario y contraseña.');
      return;
    }

    this.submitting.set(true);
    this.error.set('');

    this.authService.login(this.username.trim(), this.password).subscribe({
      next: () => {
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.error.set(err?.message || 'Credenciales incorrectas.');
        this.submitting.set(false);
      }
    });
  }
}
