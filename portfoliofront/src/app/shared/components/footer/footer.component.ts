import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PixelIconComponent } from '../../ui/pixel-icon/pixel-icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, PixelIconComponent],
  template: `
    <footer class="site-footer">
      <div class="container site-footer__inner">
        <p class="site-footer__save">
          <app-pixel-icon name="save" [size]="16" />
          <span>SAVE POINT</span>
        </p>

        <p class="site-footer__copy">
          &copy; {{ currentYear }} Gabus.dev · Front-end &amp; UX/UI
        </p>

        <nav class="site-footer__links" aria-label="Enlaces del pie de página">
          <a href="https://github.com/Gabusnow21" target="_blank" rel="noopener">
            GitHub
            <app-pixel-icon name="external" [size]="12" />
          </a>
          <a routerLink="/contact">Contacto</a>
          <a routerLink="/styleguide">Design System</a>
        </nav>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      margin-top: auto;
      padding: var(--space-6) 0;
      background: var(--rpg-ink-2);
      border-top: 2px solid var(--rpg-gold);
      box-shadow: 0 -4px 0 rgba(201, 162, 39, 0.12);
    }

    .site-footer__inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--space-3) var(--space-6);
    }

    .site-footer__save {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--rpg-gold-bright);
      font-family: var(--font-display);
      font-size: var(--text-sm);
      font-weight: 600;
      letter-spacing: 0.12em;
    }

    .site-footer__copy {
      color: var(--rpg-text-dim);
      font-size: var(--text-xs);
    }

    .site-footer__links {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--space-4);
    }

    .site-footer__links a {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      color: var(--rpg-text-muted);
      font-size: var(--text-xs);
      text-decoration: none;
    }

    .site-footer__links a:hover {
      color: var(--rpg-gold-pale);
      text-decoration: underline;
    }

    @media (max-width: 720px) {
      .site-footer__inner {
        justify-content: center;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
