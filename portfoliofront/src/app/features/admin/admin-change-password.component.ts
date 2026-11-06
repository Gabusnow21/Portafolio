import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { PixelIconComponent } from '../../shared/ui/pixel-icon/pixel-icon.component';
import { RpgButtonDirective } from '../../shared/ui/rpg-button/rpg-button.directive';
import { RpgWindowComponent } from '../../shared/ui/rpg-window/rpg-window.component';

@Component({
  selector: 'app-admin-change-password',
  standalone: true,
  imports: [FormsModule, RouterLink, PixelIconComponent, RpgButtonDirective, RpgWindowComponent],
  template: `
    <section class="rpg-section">
      <div class="container" style="max-width: 520px;">
        <app-rpg-window variant="panel" title="Cambiar contraseña">
          <div style="display:flex; flex-direction:column; gap: var(--space-4);">
            <p class="muted">Actualiza la contraseña del administrador. Debe tener al menos 6 caracteres.</p>

            <div class="login__field">
              <label for="current">Contraseña actual</label>
              <input id="current" type="password" name="current" [(ngModel)]="currentPassword" autocomplete="current-password" required>
            </div>

            <div class="login__field">
              <label for="new">Nueva contraseña</label>
              <input id="new" type="password" name="new" [(ngModel)]="newPassword" autocomplete="new-password" required>
            </div>

            <div class="login__field">
              <label for="confirm">Confirmar nueva contraseña</label>
              <input id="confirm" type="password" name="confirm" [(ngModel)]="confirmPassword" autocomplete="new-password" required>
            </div>

            @if (error()) {
              <div class="login__error" role="alert">
                <app-pixel-icon name="warning" [size]="16" />
                <span>{{ error() }}</span>
              </div>
            }
            @if (success()) {
              <div class="login__error" role="status" style="background: rgba(61,220,132,0.12); border-color: rgba(61,220,132,0.4); color: #3ddc84;">
                <app-pixel-icon name="spark" [size]="16" />
                <span>Contraseña actualizada correctamente.</span>
              </div>
            }

            <div style="display:flex; gap: var(--space-3); justify-content: flex-end;">
              <a routerLink="/admin/dashboard" class="btn">Cancelar</a>
              <button type="button" appRpgButton variant="primary" (click)="onSubmit()" [disabled]="loading()">
                {{ loading() ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </div>
        </app-rpg-window>
      </div>
    </section>
  `,
  styles: [`
    .login__field { display: flex; flex-direction: column; gap: 0.35rem; }
    .login__field label { font-size: 0.85rem; color: var(--text-secondary); }
    .login__field input {
      padding: 0.6rem 0.75rem;
      border: 1px solid var(--border);
      background: var(--bg-elevated);
      color: var(--text-primary);
      border-radius: 4px;
      font: inherit;
    }
    .login__error {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.6rem 0.75rem;
      border: 1px solid rgba(255,90,90,0.4);
      background: rgba(255,90,90,0.08);
      color: #ff8a8a;
      border-radius: 4px;
      font-size: 0.85rem;
    }
    .muted { color: var(--text-secondary); font-size: 0.9rem; }
  `]
})
export class AdminChangePasswordComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  onSubmit(): void {
    this.error.set(null);
    this.success.set(false);

    if (!this.currentPassword || !this.newPassword) {
      this.error.set('Completa todos los campos.');
      return;
    }
    if (this.newPassword.length < 6) {
      this.error.set('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error.set('La confirmación no coincide.');
      return;
    }

    this.loading.set(true);
    this.auth.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.detail || err?.error?.title || 'No se pudo cambiar la contraseña.';
        this.error.set(msg);
      }
    });
  }
}
