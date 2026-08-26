import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="header-inner container">
        <a routerLink="/" class="logo">Portfolio</a>

        <button class="menu-toggle" (click)="toggleMenu()" [attr.aria-label]="menuOpen() ? 'Cerrar menú' : 'Abrir menú'">
          <span class="hamburger" [class.open]="menuOpen()"></span>
        </button>

        <nav class="nav" [class.open]="menuOpen()">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu()">Inicio</a>
          <a routerLink="/projects" routerLinkActive="active" (click)="closeMenu()">Proyectos</a>
          <a routerLink="/contact" routerLinkActive="active" (click)="closeMenu()">Contacto</a>
          @if (authService.isLoggedIn()) {
            <a routerLink="/admin/dashboard" routerLinkActive="active" (click)="closeMenu()">Admin</a>
          }
        </nav>

        <button class="theme-toggle" (click)="themeService.toggle()" [attr.aria-label]="'Cambiar a tema ' + (themeService.theme() === 'light' ? 'oscuro' : 'claro')">
          @if (themeService.theme() === 'light') {
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          }
        </button>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--header-bg);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border);
    }
    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      gap: 1.5rem;
    }
    .logo {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .nav {
      display: flex;
      gap: 1.5rem;
    }
    .nav a {
      color: var(--text-secondary);
      font-weight: 500;
      font-size: 0.9rem;
      padding: 0.25rem 0;
      border-bottom: 2px solid transparent;
      transition: color 0.2s, border-color 0.2s;
    }
    .nav a:hover,
    .nav a.active {
      color: var(--accent);
      border-bottom-color: var(--accent);
    }
    .theme-toggle {
      background: none;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 0.4rem;
      cursor: pointer;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s, border-color 0.2s;
    }
    .theme-toggle:hover {
      color: var(--accent);
      border-color: var(--accent);
    }
    .menu-toggle {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.4rem;
    }
    .hamburger {
      display: block;
      width: 22px;
      height: 2px;
      background: var(--text-primary);
      position: relative;
      transition: background 0.2s;
    }
    .hamburger::before,
    .hamburger::after {
      content: '';
      position: absolute;
      width: 22px;
      height: 2px;
      background: var(--text-primary);
      left: 0;
      transition: transform 0.2s;
    }
    .hamburger::before { top: -7px; }
    .hamburger::after { top: 7px; }
    .hamburger.open { background: transparent; }
    .hamburger.open::before { transform: rotate(45deg) translate(5px, 5px); }
    .hamburger.open::after { transform: rotate(-45deg) translate(5px, -5px); }

    @media (max-width: 768px) {
      .menu-toggle { display: block; }
      .nav {
        display: none;
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
        background: var(--header-bg);
        backdrop-filter: blur(10px);
        flex-direction: column;
        padding: 1rem;
        border-bottom: 1px solid var(--border);
        gap: 0.5rem;
      }
      .nav.open { display: flex; }
      .nav a { padding: 0.5rem 0; }
    }
  `]
})
export class HeaderComponent {
  menuOpen = signal(false);

  constructor(public themeService: ThemeService, public authService: AuthService) {}

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
