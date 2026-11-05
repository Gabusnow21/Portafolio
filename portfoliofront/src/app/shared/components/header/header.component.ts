import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PixelIconComponent } from '../../ui/pixel-icon/pixel-icon.component';
import { RpgButtonDirective } from '../../ui/rpg-button/rpg-button.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, PixelIconComponent, RpgButtonDirective],
  template: `
    <header class="site-header" (keydown.escape)="closeMenu()">
      <div class="container site-header__inner">
        <a routerLink="/" class="site-logo" (click)="closeMenu()" aria-label="Gabus.dev — Ir al inicio">
          <span class="site-logo__mark" aria-hidden="true">
            <app-pixel-icon name="sword" [size]="20" />
          </span>
          <span class="site-logo__text">
            GABUS<span class="site-logo__dot">.</span>DEV
          </span>
        </a>

        <button
          type="button"
          class="site-menu-toggle"
          (click)="toggleMenu()"
          [attr.aria-expanded]="menuOpen()"
          aria-controls="site-nav"
          [attr.aria-label]="menuOpen() ? 'Cerrar menú' : 'Abrir menú'"
        >
          <app-pixel-icon [name]="menuOpen() ? 'close' : 'menu'" [size]="22" />
        </button>

        <nav
          id="site-nav"
          class="site-nav"
          [class.is-open]="menuOpen()"
          aria-label="Navegación principal"
        >
          <a
            routerLink="/"
            appRpgButton
            variant="menu"
            routerLinkActive
            [routerLinkActiveOptions]="{ exact: true }"
            ariaCurrentWhenActive="page"
            (click)="closeMenu()"
          >
            Inicio
          </a>
          <a
            routerLink="/about"
            appRpgButton
            variant="menu"
            routerLinkActive
            ariaCurrentWhenActive="page"
            (click)="closeMenu()"
          >
            Sobre mí
          </a>
          <a
            routerLink="/projects"
            appRpgButton
            variant="menu"
            routerLinkActive
            ariaCurrentWhenActive="page"
            (click)="closeMenu()"
          >
            Quest Log
          </a>
          <a
            routerLink="/contact"
            appRpgButton
            variant="menu"
            routerLinkActive
            ariaCurrentWhenActive="page"
            (click)="closeMenu()"
          >
            Contacto
          </a>

          @if (authService.isLoggedIn()) {
            <a
              routerLink="/admin/dashboard"
              appRpgButton
              variant="menu"
              routerLinkActive
              ariaCurrentWhenActive="page"
              (click)="closeMenu()"
            >
              Admin
            </a>
          }
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .site-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(7, 11, 26, 0.97);
      border-bottom: 2px solid var(--rpg-gold);
      box-shadow: 0 4px 0 rgba(201, 162, 39, 0.18);
      backdrop-filter: blur(8px);
    }

    .site-header__inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
      min-height: var(--header-h);
    }

    .site-logo {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--rpg-gold-bright);
      font-family: var(--font-display);
      font-size: var(--text-xl);
      font-weight: 700;
      letter-spacing: 0.08em;
      text-decoration: none;
      white-space: nowrap;
    }

    .site-logo:hover {
      color: var(--rpg-gold-pale);
    }

    .site-logo__mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border: 2px solid var(--rpg-gold);
      background: var(--rpg-window-deep);
      box-shadow:
        inset 2px 2px 0 var(--rpg-bevel-light),
        inset -2px -2px 0 var(--rpg-bevel-dark),
        2px 2px 0 var(--rpg-shadow);
      color: var(--rpg-gold-pale);
    }

    .site-logo__dot {
      color: var(--rpg-text);
    }

    .site-nav {
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    .site-nav .rpg-button--menu {
      width: auto;
    }

    .site-menu-toggle {
      display: none;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border: 2px solid var(--rpg-gold);
      background: var(--rpg-window-deep);
      color: var(--rpg-gold-pale);
      box-shadow:
        inset 2px 2px 0 var(--rpg-bevel-light),
        inset -2px -2px 0 var(--rpg-bevel-dark),
        2px 2px 0 var(--rpg-shadow);
      cursor: pointer;
    }

    .site-menu-toggle:hover {
      background: var(--rpg-window);
      color: var(--rpg-gold-bright);
    }

    @media (max-width: 820px) {
      .site-menu-toggle {
        display: inline-flex;
      }

      .site-nav {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        align-items: stretch;
        gap: 2px;
        padding: var(--space-3);
        background: var(--rpg-window-deep);
        border-bottom: 2px solid var(--rpg-gold);
        box-shadow: var(--shadow-hard);
      }

      .site-nav.is-open {
        display: flex;
      }

      .site-nav .rpg-button--menu {
        width: 100%;
        min-height: 44px;
      }
    }
  `]
})
export class HeaderComponent {
  menuOpen = signal(false);

  constructor(public authService: AuthService) {}

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
